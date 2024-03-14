import { Controller, Get, Post,UseGuards,Query, StreamableFile, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '../authguard/auth.guard';
import * as path from 'path';
import { Response } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  //upload file
  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return  this.mediaService.uploadFile(file);
  }
  //upload file

  //files length
  @Get('FilesLength')
  @UseGuards(AuthGuard)
  ReturnFilesLength(): { Images: number; Videos: number; Other: number }{
    return this.mediaService.FetchFilesLength();
  }
  //files length

  //image gallery
  @Get('GetFileNames')
  @UseGuards(AuthGuard)
  async GetFileNames(@Query('fileType') fileType:string, @Query('PageNo')Pageno:number,@Query('PageSize')PageSize:number): Promise<string[]>{
    return this.mediaService.GetFileNames(fileType,Pageno,PageSize);
  }

  @Get('serveImage')
  @UseGuards(AuthGuard)
  async ServeImage(
    @Query('fileName') fileName: string,
    @Query('IsThumbnail')IsThumbnail:string,
    @Query('fileType')fileType:string,
      @Res() res: Response) {
    return this.mediaService.serveImage(fileName,IsThumbnail,fileType, res);
  }

  @Get('serveFile') 
  //@UseGuards(AuthGuard)
  async ServeFile(
    @Query('fileName') fileName: string,
    @Query('fileType')fileType:string,
      @Res() res: Response) {
    return this.mediaService.serveFile(fileName,fileType, res);
  }
  //image gallery


  //delete 1 file with name
  @Get('deleteFile')
  @UseGuards(AuthGuard)
  async deleteFile(@Query('fileName') fileName: string,@Query('fileType')fileType:string): Promise<string> {
    return this.mediaService.DeleteFile(fileName,fileType);
  }
  //delete 1 file with name


  //delete all files of category
  @Get('deleteAllFiles')
  @UseGuards(AuthGuard)
  async deleteAllFiles(@Query('fileType')fileType:string): Promise<string> {
    return this.mediaService.DeleteAllFiles(fileType);
  }
  //delete all files of category
  
  
  //GetAllFilesStats
  @Get('GetAllFilesStats')
  @UseGuards(AuthGuard)
  async GetAllFilesStats(): Promise<string> {
    return this.mediaService.GetAllFilesStats();
  }
  //GetAllFilesStats

}
