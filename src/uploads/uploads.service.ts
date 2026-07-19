import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

@Injectable()
export class UploadsService {
  private readonly bucket: string;
  private client: SupabaseClient | null = null;

  constructor(private readonly config: ConfigService) {
    this.bucket =
      this.config.get<string>('SUPABASE_BUCKET') ?? 'feedback-images';
  }

  // Lazy so a missing/placeholder Supabase config doesn't crash the whole
  // API at boot — only the upload endpoint fails, with a clear message.
  private getClient(): SupabaseClient {
    if (this.client) return this.client;

    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new InternalServerErrorException(
        'Image storage is not configured yet — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      );
    }

    this.client = createClient(url, key);
    return this.client;
  }

  async uploadFeedbackImage(
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, WEBP or GIF images are allowed',
      );
    }

    const client = this.getClient();
    const path = `feedback/${randomUUID()}${extname(file.originalname)}`;

    const { error } = await client.storage
      .from(this.bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) {
      throw new InternalServerErrorException(
        `Image upload failed: ${error.message}`,
      );
    }

    const { data } = client.storage.from(this.bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }
}
