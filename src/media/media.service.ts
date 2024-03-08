import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
    private readonly uploadBasePath: string;

    constructor() {
        this.uploadBasePath = process.env.NODE_ENV === 'production'
            ? path.join(process.cwd(), '/dist/uploads')
            : path.join(process.cwd(), '/uploads'); 
            
    }

    uploadFile(file: Express.Multer.File): string {
        if (!file) {
            return 'No file provided';
        }
        console.log('File:', file);
        return `File ${file} uploaded successfully.`;
    }

    getFiles(Ftype: string, Page: number, PageSize: number, res: Response) {
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
