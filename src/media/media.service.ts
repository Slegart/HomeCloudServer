import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class MediaService {
    private readonly uploadBasePath: string;

    constructor() {
        this.uploadBasePath = process.env.NODE_ENV === 'production'
            ? path.join(__dirname, '/dist/uploads')
            : path.join(__dirname, '/uploads'); 
    }

    uploadFile(file: Express.Multer.File): string {
        if (!file) {
            return 'No file provided';
        }
        console.log('File:', file);
        return `File ${file} uploaded successfully.`;
    }

    FetchFiles(Ftype: string, Page: number, PageSize: number): string {
        return `Fetching files of type: ${Ftype} on page: ${Page} with page size: ${PageSize}`;
    }


    FetchFilesLength(): string {
        console.log('UploadBasePath:', this.uploadBasePath);
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

        return `Images: ${ImageFilesLength}, Videos: ${VideoFilesLength}, Other: ${OtherFilesLength}`;
    }
}
