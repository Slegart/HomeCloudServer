
import * as path from 'path';
import * as fs from 'fs';

export class FileIntegrity {
    public static uploadBasePath: string;

    constructor() {
        FileIntegrity.uploadBasePath = process.env.NODE_ENV === 'production'
            ? path.join(process.cwd(), '/dist/uploads')
            : path.join(process.cwd(), '/uploads');
    }

    public async CheckFileLocations(): Promise<boolean> {
        try
        {
                 const UploadsFile = path.join(FileIntegrity.uploadBasePath);
        console.log('UploadsFile:', UploadsFile);
        if (!fs.existsSync(UploadsFile)) {
            fs.mkdirSync(UploadsFile);
        }
        const ImageFiles = path.join(FileIntegrity.uploadBasePath, 'images');
        const VideoFiles = path.join(FileIntegrity.uploadBasePath, 'videos');
        const OtherFiles = path.join(FileIntegrity.uploadBasePath, 'other');

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
        catch (error) {
            console.error('Error checking file locations:', error);
            return false;
        }
   
    }
}