import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // Public bucket, random UUID filenames — the response shape ({ url }) is
  // the only contract the frontend depends on, so the storage provider
  // behind UploadsService can change without touching callers.
  @Post('feedback-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  uploadFeedbackImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    return this.uploadsService.uploadFeedbackImage(file);
  }
}
