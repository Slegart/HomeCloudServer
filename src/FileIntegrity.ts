
import * as path from 'path';
import * as fs from 'fs';

export class FileIntegrity {
    private readonly uploadBasePath: string;

    constructor() {
        this.uploadBasePath = process.env.NODE_ENV === 'production'
            ? path.join(process.cwd(), '/dist/uploads')
            : path.join(process.cwd(), '/uploads');
    }

    public async CheckFileLocations(): Promise<boolean> {
        const UploadsFile = path.join(this.uploadBasePath);
        console.log('UploadsFile:', UploadsFile);
        if (!fs.existsSync(UploadsFile)) {
            fs.mkdirSync(UploadsFile);
        }
        const ImageFiles = path.join(this.uploadBasePath, 'images');
        const VideoFiles = path.join(this.uploadBasePath, 'videos');
        const OtherFiles = path.join(this.uploadBasePath, 'other');

        if (!fs.existsSync(ImageFiles)) {
            fs.mkdirSync(ImageFiles);
        }
        if (!fs.existsSync(VideoFiles)) {
            fs.mkdirSync(VideoFiles);
        }
        if (!fs.existsSync(OtherFiles)) {
            fs.mkdirSync(OtherFiles);
        }
        return true;
    }
}