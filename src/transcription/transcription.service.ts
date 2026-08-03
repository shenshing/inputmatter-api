import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { AutomaticSpeechRecognitionPipeline } from '@xenova/transformers';
import { randomUUID } from 'crypto';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { PassThrough } from 'stream';

// English-only checkpoint: smaller and more accurate for English than the
// multilingual model of the same size, since it isn't splitting capacity
// across ~99 languages. Swap for a multilingual checkpoint (e.g.
// Xenova/whisper-small) if Khmer gets added back later.
const MODEL = 'Xenova/whisper-base.en';

// Browsers report recorder mime types with a codecs suffix (e.g.
// "audio/webm;codecs=opus") — matched against the base type below.
const ALLOWED_MIME_TYPES = [
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
];

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);
  private pipelinePromise: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

  constructor() {
    if (ffmpegPath) {
      ffmpeg.setFfmpegPath(ffmpegPath);
    }
  }

  // Lazy + memoized: the model loads once, on the first request, and stays
  // warm in memory for every request after — not reloaded per call. Lazy
  // also means a broken/slow model load only fails this endpoint, not the
  // whole API at boot (same reasoning as UploadsService.getClient()).
  private getPipeline(): Promise<AutomaticSpeechRecognitionPipeline> {
    if (!this.pipelinePromise) {
      this.logger.log(`Loading ${MODEL}...`);
      // @xenova/transformers is ESM-only; this project compiles to
      // CommonJS, so a static import would fail at runtime with
      // ERR_REQUIRE_ESM. A dynamic import() is the sanctioned way for a
      // CJS module to load a pure-ESM package.
      this.pipelinePromise = import('@xenova/transformers').then(
        ({ pipeline, env }) => {
          // Default cache dir lives inside node_modules, which `nest
          // start --watch` treats as a source change — on a fresh
          // machine, the download writing new files there can trigger a
          // restart mid-download, killing the first request. Redirecting
          // it outside node_modules avoids that; the model is cached to
          // disk after the first successful load either way.
          env.cacheDir = join(__dirname, '..', '..', '.model-cache') + '/';
          return pipeline('automatic-speech-recognition', MODEL);
        },
      );
    }
    return this.pipelinePromise;
  }

  async transcribe(
    buffer: Buffer,
    mimetype: string,
  ): Promise<{ transcript: string }> {
    const baseType = mimetype.split(';')[0].trim();
    if (!ALLOWED_MIME_TYPES.includes(baseType)) {
      throw new BadRequestException(`Unsupported audio type: ${baseType}`);
    }

    let pcm: Float32Array;
    try {
      pcm = await this.decodeToPcm(buffer);
    } catch {
      throw new BadRequestException('Could not decode the audio recording.');
    }

    if (pcm.length === 0) {
      throw new BadRequestException('No audio detected in the recording.');
    }

    try {
      const transcriber = await this.getPipeline();
      const result = await transcriber(pcm);
      const output = Array.isArray(result) ? result[0] : result;
      return { transcript: (output?.text ?? '').trim() };
    } catch (error) {
      this.logger.error(
        'Transcription failed',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException(
        'Transcription failed. Please try again.',
      );
    }
  }

  // Decodes whatever container/codec the browser recorded (webm/opus,
  // mp4/aac, ...) into raw 16kHz mono float32 PCM — the exact input format
  // Whisper's feature extractor expects. The upload is written to a
  // short-lived temp file rather than piped directly: MP4/M4A (Safari/iOS)
  // stores its metadata atom in a way that requires a seekable input to
  // parse, which a stdin pipe can't provide — ffmpeg silently produces no
  // output for it otherwise. The temp file is deleted immediately after
  // decoding either way; audio is never persisted beyond this call.
  private async decodeToPcm(buffer: Buffer): Promise<Float32Array> {
    const tmpDir = await mkdtemp(join(tmpdir(), 'voice-'));
    const inputPath = join(tmpDir, randomUUID());
    try {
      await writeFile(inputPath, buffer);
      return await new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        const output = new PassThrough();
        output.on('data', (chunk: Buffer) => chunks.push(chunk));

        ffmpeg(inputPath)
          .audioFrequency(16000)
          .audioChannels(1)
          .format('f32le')
          .on('error', (err: Error) => reject(err))
          .on('end', () =>
            resolve(this.bufferToFloat32Array(Buffer.concat(chunks))),
          )
          .pipe(output, { end: true });
      });
    } finally {
      await rm(tmpDir, { recursive: true, force: true });
    }
  }

  private bufferToFloat32Array(buffer: Buffer): Float32Array {
    const samples = new Float32Array(Math.floor(buffer.length / 4));
    for (let i = 0; i < samples.length; i++) {
      samples[i] = buffer.readFloatLE(i * 4);
    }
    return samples;
  }
}
