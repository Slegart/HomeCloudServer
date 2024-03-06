import { Controller, Get, Post,UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '../authguard/auth.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    return this.mediaService.uploadFile(file);
  }
  @Get('FilesLength')
  @UseGuards(AuthGuard)
  ReturnFilesLength(): string {
    return this.mediaService.FetchFilesLength();
  }
}
