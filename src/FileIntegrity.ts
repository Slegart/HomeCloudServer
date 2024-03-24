import * as path from 'path';
import * as fs from 'fs';

export class FileIntegrity {
    public static uploadBasePath: string;
    public static SettingsFile: string;
    public static CertificatePath: string; 
    public static AuthPath: string;

    constructor() {
        FileIntegrity.uploadBasePath = '/Uploads';
        
        FileIntegrity.SettingsFile = path.join(FileIntegrity.uploadBasePath, 'settings/settings.json');
        FileIntegrity.AuthPath = path.join(FileIntegrity.uploadBasePath, 'auth/auth.json');

        FileIntegrity.CertificatePath = process.env.NODE_ENV === 'production'
            ? path.join(FileIntegrity.uploadBasePath, 'dist/certificates')
            : path.join(FileIntegrity.uploadBasePath, 'certificates');
    }

    public async CheckAuthJson(): Promise<boolean> {
        try {
            if (!fs.existsSync(FileIntegrity.AuthPath)) {
                fs.writeFileSync(FileIntegrity.AuthPath, JSON.stringify({  
                    username: 'admin',
                    password: 'admin' }));
            }
            return true;
        }
        catch (error) {
            console.error('Error checking auth file:', error);
            return false;
        }
    }

    public async CheckSettingJson(): Promise<boolean> {
        try {
            if (!fs.existsSync(FileIntegrity.SettingsFile)) {
                fs.writeFileSync(FileIntegrity.SettingsFile, JSON.stringify({  
                    IsThumbnailEnabled: false,
                    isFullSizeImagesEnabled: false,
                    sessionDuration: 10000,
                    HTTPSEnabled: false,
                    InitialConnectionFinished: false,
                    port: 5000 }));
            }
            return true;
        }
        catch (error) {
            console.error('Error checking settings file:', error);
            return false;
        }
    }

    public async CheckFileLocations(): Promise<boolean> {
        try {
            const UploadsFile = FileIntegrity.uploadBasePath;
            try {
                if (!fs.existsSync(UploadsFile)) {
                    fs.mkdirSync(UploadsFile);
                    console.log(`Directory created successfully: ${UploadsFile}`);
                } else {
                    console.log(`Directory already exists: ${UploadsFile}`);
                }
            } catch (error) {
                console.error('Error creating directory:', error);
            }

            // Adjust other paths accordingly
            const ImageFiles = path.join(FileIntegrity.uploadBasePath, 'images');
            const VideoFiles = path.join(FileIntegrity.uploadBasePath, 'videos');
            const OtherFiles = path.join(FileIntegrity.uploadBasePath, 'other');
            const CertificatePath = FileIntegrity.CertificatePath;
            const ImageThumbnailFiles = path.join(FileIntegrity.uploadBasePath, 'Imagethumbnails');
            const SettingsFile = path.join(FileIntegrity.uploadBasePath, 'settings');
            const AuthFile = path.join(FileIntegrity.uploadBasePath, 'auth');

            if (!fs.existsSync(SettingsFile)) {
                fs.mkdirSync(SettingsFile);
            }
            if (!fs.existsSync(AuthFile)) {
                fs.mkdirSync(AuthFile);
            }
            if (!fs.existsSync(CertificatePath)) {
                fs.mkdirSync(CertificatePath);
            }
            if (!fs.existsSync(ImageFiles)) {
                fs.mkdirSync(ImageFiles);
            }
            if (!fs.existsSync(VideoFiles)) {
                fs.mkdirSync(VideoFiles);
            }
            if (!fs.existsSync(OtherFiles)) {
                fs.mkdirSync(OtherFiles);
            }
            if (!fs.existsSync(ImageThumbnailFiles)) {
                fs.mkdirSync(ImageThumbnailFiles);
            }

            return true;
        }
        catch (error) {
            console.error('Error checking file locations:', error);
            return false;
        }
    }
}
