import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { FileIntegrity } from '@app/FileIntegrity';
@Injectable()
export class MediaService {
    private readonly fileIntegrity = new FileIntegrity();

    async uploadFile(file: Express.Multer.File): Promise<string> {
        await this.fileIntegrity.CheckFileLocations();
        if (!file) {
            return 'No file provided';
        }
        console.log('File:', file);
        return `Success`;
    }

    FetchFilesLength():  { Images: number; Videos: number; Other: number } {
        
        const ImageFiles = path.join(FileIntegrity.uploadBasePath, 'images');
        const VideoFiles = path.join(FileIntegrity.uploadBasePath, 'videos');
        const OtherFiles = path.join(FileIntegrity.uploadBasePath, 'other');

        const fs = require('fs');
        let ImageFilesLength = 0;
        let VideoFilesLength = 0;
        let OtherFilesLength = 0;

        if (fs.existsSync(ImageFiles)) {
            ImageFilesLength = fs.readdirSync(ImageFiles).length;
        }
        if (fs.existsSync(VideoFiles)) {
            VideoFilesLength = fs.readdirSync(VideoFiles).length;
        }
        if (fs.existsSync(OtherFiles)) {
            OtherFilesLength = fs.readdirSync(OtherFiles).length;
        }

        return {Images: ImageFilesLength, Videos: VideoFilesLength, Other: OtherFilesLength};
    }

    async getFiles(Ftype: string, Page: number, PageSize: number, res: Response) {
        await this.fileIntegrity.CheckFileLocations();
        console.log('Ftype:', Ftype);
        if (!Ftype) {
            console.log('No file type provided');
        }
        if (Ftype !== 'images' && Ftype !== 'videos' && Ftype !== 'other') {
            console.log('Invalid file type');
        }
        const FilesPath = path.join(FileIntegrity.uploadBasePath, Ftype);
        const fs = require('fs');
        if (!fs.existsSync(FilesPath)) {
            console.log('FilesPath does not exist');
        } else {
            const FilesLen = fs.readdirSync(FilesPath).length;
            if (PageSize > FilesLen) {
                const docname = fs.readdirSync(FilesPath)[0];
                console.log('docname:', docname);
                const filepath = path.join(FilesPath, docname);
                console.log('filepath:', filepath);
                const fileStream = fs.createReadStream(filepath);
                fileStream.pipe(res);
            }
        }
    }

    //gallery

    // async serveImage(fileName: string, res: Response)  {
    //     console.log('serveImage');
    //     await this.fileIntegrity.CheckFileLocations();
    //     try {
    //       console.log('Received fileName:', fileName);
    //       const imagePath = path.join(FileIntegrity.uploadBasePath, '..', 'uploads', 'images', fileName);

    //       const fs = require('fs');
    
    //       if (fs.existsSync(imagePath)) {
    
    //         const ext = path.extname(imagePath).slice(1);
    //         const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    //         res.header('Content-Type', contentType);
    //         fs.createReadStream(imagePath).pipe(res);
    //       } else {
    //         res.status(404).send('Not Found');
    //       }
    //     } catch (error) {
    //       console.error('Error serving image:', error);
    //       res.status(500).send('Internal Server Error');
    //     }
    // }
    
    async GetImagesnames(Pageno:number,PageSize:number): Promise<string[]> {
        console.log('GetImagesnames');
        console.log('Pageno:', Pageno);
        console.log('PageSize:', PageSize);
        await this.fileIntegrity.CheckFileLocations();
        console.log('GetImagesLinks');
        const ImageFilesPath = path.join(FileIntegrity.uploadBasePath, 'images');
        const fs = require('fs');

        const TotalImages = fs.readdirSync(ImageFilesPath).length;
        if(Pageno*PageSize>TotalImages){
            console.log("last page")
            return fs.readdirSync(ImageFilesPath).slice((Pageno-1)*PageSize,TotalImages);
        }
        else{
            console.log("not last page")
            return fs.readdirSync(ImageFilesPath).slice((Pageno-1)*PageSize,Pageno*PageSize);
        }
    }

    //documents

    async GetFileNames(fileType: string, Pageno: number, PageSize: number): Promise<string[]> {
        //fileType: images, videos, other
        console.log(`Get${fileType}Names`);
        console.log('Pageno:', Pageno);
        console.log('PageSize:', PageSize);
        await this.fileIntegrity.CheckFileLocations();
        console.log(`Get${fileType}Links`);
      
        const filePath = path.join(FileIntegrity.uploadBasePath, fileType);
        const fs = require('fs');
      
        const totalFiles = fs.readdirSync(filePath).length;
        if (Pageno * PageSize > totalFiles) {
          console.log("last page");
          return fs.readdirSync(filePath).slice((Pageno - 1) * PageSize, totalFiles);
        } else {
          console.log("not last page");
          return fs.readdirSync(filePath).slice((Pageno - 1) * PageSize, Pageno * PageSize);
        }
      }
      

      async serveFile(fileName: string, fileType: string, res: Response) {
        //fileType: images, videos, other

        console.log(`serve ${fileType}`);
        await this.fileIntegrity.CheckFileLocations();
        try {
          console.log('Received fileName:', fileName);
          const filePath = path.join(FileIntegrity.uploadBasePath, '..', 'uploads', fileType, fileName);
          console.log('filePathhhh:', filePath);
          const fs = require('fs');
      
          if (fs.existsSync(filePath)) {
            console.log('File exists');
            const ext = path.extname(filePath).slice(1);
            let contentType = '';
      
            if (fileType === 'images') {
              contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
            } else if (fileType === 'other') {
              contentType = `application/${ext}`;
            }
      
            res.header('Content-Type', contentType);
            fs.createReadStream(filePath).pipe(res);
          } else {
            res.status(404).send('Not Found');
          }
        } catch (error) {
          console.error(`Error serving ${fileType}:`, error);
          res.status(500).send('Internal Server Error');
        }
      }

}
