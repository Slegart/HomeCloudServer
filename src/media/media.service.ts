import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { FileIntegrity } from '@app/FileIntegrity';
@Injectable()
export class MediaService {
    private readonly uploadBasePath: string;
    private readonly fileIntegrity = new FileIntegrity();

    constructor() {
        this.uploadBasePath = process.env.NODE_ENV === 'production'
            ? path.join(process.cwd(), '/dist/uploads')
            : path.join(process.cwd(), '/uploads'); 
            
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        await this.fileIntegrity.CheckFileLocations();
        if (!file) {
            return 'No file provided';
        }
        console.log('File:', file);
        return `File ${file} uploaded successfully.`;
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
        const FilesPath = path.join(this.uploadBasePath, Ftype);
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

    FetchFilesLength():  { Images: number; Videos: number; Other: number } {
        const ImageFiles = path.join(this.uploadBasePath, 'images');
        const VideoFiles = path.join(this.uploadBasePath, 'videos');
        const OtherFiles = path.join(this.uploadBasePath, 'other');

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

    async serveImage(fileName: string, res: Response)  {
        await this.fileIntegrity.CheckFileLocations();
        try {
          console.log('Received fileName:', fileName);
          const imagePath = path.join(this.uploadBasePath, '..', 'uploads', 'images', fileName);

          const fs = require('fs');
    
          if (fs.existsSync(imagePath)) {
    
            const ext = path.extname(imagePath).slice(1);
            const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
            res.header('Content-Type', contentType);
            fs.createReadStream(imagePath).pipe(res);
          } else {
            res.status(404).send('Not Found');
          }
        } catch (error) {
          console.error('Error serving image:', error);
          res.status(500).send('Internal Server Error');
        }
    }
    
    async GetImagesnames(): Promise<string[]> {
        await this.fileIntegrity.CheckFileLocations();
        const ImageLinks = [];
        console.log('GetImagesLinks');
        const ImageFilesPath = path.join(this.uploadBasePath, 'images');
        const fs = require('fs');
    
        if (fs.existsSync(ImageFilesPath)) {
            const imageFiles = fs.readdirSync(ImageFilesPath);
            console.log('ImageFiles2:', imageFiles);
           return imageFiles;
        }

    }
 
}
