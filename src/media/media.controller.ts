import { Controller, Get, Post,UseGuards,Query, StreamableFile, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '../authguard/auth.guard';
import path from 'path';


@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    return this.mediaService.uploadFile(file);
  }

  @Get('getFiles')
  @UseGuards(AuthGuard)
  async getImage(@Query('Ftype') Ftype: string, @Query('Page') Page: number,@Query('PageSize') PageSize:number , @Res() res: Response) {
    return this.mediaService.getFiles(Ftype, Page, PageSize, res);
  }

  @Get('FilesLength')
  @UseGuards(AuthGuard)
  ReturnFilesLength(): { Images: number; Videos: number; Other: number }{
    return this.mediaService.FetchFilesLength();
  }
}
