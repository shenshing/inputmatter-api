import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TranscriptionService } from './transcription.service';

// Recordings are capped at 5s client-side, so even at generous bitrates
// this is far more headroom than a single clip needs.
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

@Controller('transcription')
export class TranscriptionController {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Post('voice')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  transcribeVoice(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ transcript: string }> {
    if (!file) {
      throw new BadRequestException('No audio file uploaded');
    }
    return this.transcriptionService.transcribe(file.buffer, file.mimetype);
  }
}
