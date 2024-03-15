import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as fs from 'fs';
import { readFile } from 'fs/promises';
import * as sharp from 'sharp';
import * as path from 'path';
import { Response } from 'express';
import { FileIntegrity } from '@app/FileIntegrity';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  private readonly fileIntegrity = new FileIntegrity();

  async uploadFile(file: Express.Multer.File): Promise<string> {
    await this.fileIntegrity.CheckFileLocations();
    await this.fileIntegrity.CheckSettingJson();
    if (!file) {
      return 'No file provided';
    }
    //console.log('File:', file);
    const settingsFileContent = fs.readFileSync(FileIntegrity.SettingsFile, 'utf-8');
    const settings = JSON.parse(settingsFileContent);
    console.log(settings.IsThumbnailEnabled);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
      if (file.size < 1024 * 1024) {
        //file small enough, no need to compress
        return `Success`;
      }
      if (settings.IsThumbnailEnabled) {
        console.log("CreateThumbnail")
        this.CreateThumbnail(file)
      }
    }

    if (file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/avi' ||
      file.mimetype === 'video/mov' ||
      file.mimetype === 'video/wmv' ||
      file.mimetype === 'video/flv' ||
      file.mimetype === 'video/mkv' ||
      file.mimetype === 'video/webm') {
      console.log("video")
    }
    return `Success`;
  }

  async CreateVideoThumbnail(FileType: string, FileName: string): Promise<string> {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);

    await this.fileIntegrity.CheckFileLocations();
    const VideosFilePath = path.join(FileIntegrity.uploadBasePath, FileType);

    const filepath = path.join(VideosFilePath, FileName);
    const promise = new Promise<string>((resolve, reject) => {
      ffmpeg(filepath)
        .seekInput(1)
        .frames(1)
        .format('image2pipe')
        .pipe()
        .on('data', (chunk: any) => {
          resolve(chunk.toString('base64'));
        })
        .on('error', (err: Error) => {
          reject(err);
        });
    });

    return promise;
  }

  CreateThumbnail(file: Express.Multer.File) {
    const ThumbnailPath = path.join(FileIntegrity.uploadBasePath, 'Imagethumbnails');
    if (!fs.existsSync(ThumbnailPath)) {
      fs.mkdirSync(ThumbnailPath);
    }
    const ThumbnailName = file.filename;
    const ThumbnailFilePath = path.join(ThumbnailPath, ThumbnailName);
    console.log("mimetype:eeeeeeeeeeeeeeeee ", file.mimetype)
    const data = sharp(file.path)
      .resize({ width: 500, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, force: false })
      .webp({ quality: 80, lossless: true, force: false })
      .png({ quality: 80, compressionLevel: 8, force: false })
      .withMetadata()
      .toFile(ThumbnailFilePath)
      .then((info) => {
        console.log("info: ", info)
      })
  }

  FetchFilesLength(): { Images: number; Videos: number; Other: number } {

    const ImageFiles = path.join(FileIntegrity.uploadBasePath, 'images');
    const VideoFiles = path.join(FileIntegrity.uploadBasePath, 'videos');
    const OtherFiles = path.join(FileIntegrity.uploadBasePath, 'other');

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

    return { Images: ImageFilesLength, Videos: VideoFilesLength, Other: OtherFilesLength };
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

  async GetImagesnames(Pageno: number, PageSize: number): Promise<string[]> {
    await this.fileIntegrity.CheckFileLocations();
    const ImageFilesPath = path.join(FileIntegrity.uploadBasePath, 'images');
    const fs = require('fs');

    const TotalImages = fs.readdirSync(ImageFilesPath).length;
    if (Pageno * PageSize > TotalImages) {
      return fs.readdirSync(ImageFilesPath).slice((Pageno - 1) * PageSize, TotalImages);
    }
    else {
      return fs.readdirSync(ImageFilesPath).slice((Pageno - 1) * PageSize, Pageno * PageSize);
    }
  }

  async GetFileNames(fileType: string, Pageno: number, PageSize: number): Promise<string[]> {
    //fileType: images, videos, other

    await this.fileIntegrity.CheckFileLocations();
    const filePath = path.join(FileIntegrity.uploadBasePath, fileType);
    const fs = require('fs');

    const totalFiles = fs.readdirSync(filePath).length;
    if (Pageno * PageSize > totalFiles) {
      return fs.readdirSync(filePath).slice((Pageno - 1) * PageSize, totalFiles);
    } else {
      return fs.readdirSync(filePath).slice((Pageno - 1) * PageSize, Pageno * PageSize);
    }
  }

  async serveImage(fileName: string, IsThumbnail: string, fileType: string, res: Response) {
    //fileType: images, videos, other
    const fs = require('fs');
    await this.fileIntegrity.CheckFileLocations();

    try {
      if (JSON.parse(fs.readFileSync(FileIntegrity.SettingsFile, 'utf-8')).IsThumbnailEnabled) {
        //ekstra depolama acik
        console.log("thumbnail storage enabled")
        console.log('thumbnail enabled? true');
        let filePath = ""
        if (IsThumbnail === "true") { filePath = path.join(FileIntegrity.uploadBasePath, '..', 'uploads', 'Imagethumbnails', fileName); }
        else { filePath = path.join(FileIntegrity.uploadBasePath, '..', 'uploads', fileType, fileName) }

        console.log('filePathh:', filePath);


        if (fs.existsSync(filePath)) {
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
          filePath = path.join(FileIntegrity.uploadBasePath, '..', 'uploads', fileType, fileName)
          if (fs.existsSync(filePath
          )) {
            console.log("thumbnail not found")
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
        }
      }
      else {
        console.log("thumbnail storage not enabled")
        //ekstra depolama kapalı
        if (IsThumbnail === "false") {
          //tam resimi gonder
          const filePath = path.join(FileIntegrity.uploadBasePath, '..', 'uploads', fileType, fileName);
          const ext = path.extname(filePath).slice(1);
          let contentType = '';

          if (fileType === 'images') {
            contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
          } else if (fileType === 'other') {
            contentType = `application/${ext}`;
          }

          res.header('Content-Type', contentType);

          fs.createReadStream(filePath).pipe(res);
        }
        else if (IsThumbnail === "true") {
          //kucuk resmi gonder
          const filePath = path.join(FileIntegrity.uploadBasePath, '..', 'uploads', fileType, fileName);
          console.log('filePath:', filePath);

          if (fs.existsSync(filePath)) {
            console.log('file exists');

            const ext = path.extname(filePath).slice(1);
            let contentType = '';

            if (fileType === 'images') {
              contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
            } else if (fileType === 'other') {
              contentType = `application/${ext}`;
            }

            res.header('Content-Type', contentType);

            const lowQualityImage = await sharp(filePath)
              .resize(200, 200)
              .withMetadata()
              .toBuffer();

            res.end(lowQualityImage);
          } else {
            res.status(404).send('Not Found');
          }
        }

      }

    } catch (error) {
      console.error(`Error serving ${fileType}:`, error);
      res.status(500).send('Internal Server Error');
    }
  }

  async serveFile(fileName: string, fileType: string, res: Response) {
    //only filetype other & videos
    console.log('Received fileName:', fileName);

    await this.fileIntegrity.CheckFileLocations();
    const filePath = path.join(FileIntegrity.uploadBasePath, fileType, fileName);
    console.log('filePath:', filePath);
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).slice(1);
      let contentType = '';

      contentType = `application/${ext}`;

      res.header('Content-Type', contentType);

      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(404).send('Not Found');
    }

  }

  async DeleteFile(fileName: string, fileType: string): Promise<string> {
    //fileType: images, videos, other
    console.log(`Delete ${fileType}`);
    console.log('Received fileName:', fileName);
    await this.fileIntegrity.CheckFileLocations();
    const filePath = path.join(FileIntegrity.uploadBasePath, fileType, fileName);
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return 'Success';
    } else {
      return 'File not found';
    }
  }

  async DeleteAllFiles(fileType: string): Promise<string> {
    //fileType: images, videos, other
    if (fileType === 'images' || fileType === 'videos' || fileType === 'other') {
      console.log(`DeleteAll ${fileType}`);
      await this.fileIntegrity.CheckFileLocations();
      const filePath = path.join(FileIntegrity.uploadBasePath, fileType);
      const fs = require('fs');
      if (fs.existsSync(filePath)) {
        fs.rmdirSync(filePath, { recursive: true });
        return 'Success';
      } else {
        return 'Folder not found';
      }
    }
    else if (fileType === "all") {
      console.log(`DeleteAll ${fileType}`);
      await this.fileIntegrity.CheckFileLocations();
      const imagesPath = path.join(FileIntegrity.uploadBasePath, 'images');
      const videosPath = path.join(FileIntegrity.uploadBasePath, 'videos');
      const otherPath = path.join(FileIntegrity.uploadBasePath, 'other');
      const fs = require('fs');
      if (fs.existsSync(imagesPath)) {
        fs.rmdirSync(imagesPath, { recursive: true });
      }
      if (fs.existsSync(videosPath)) {
        fs.rmdirSync(videosPath, { recursive: true });
      }
      if (fs.existsSync(otherPath)) {
        fs.rmdirSync(otherPath, { recursive: true });
      }
      return 'Success';
    }
  }

  async GetAllFilesStats(): Promise<string> {
    console.log('GetAllFilesStats');
    await this.fileIntegrity.CheckFileLocations();
    const Images = path.join(FileIntegrity.uploadBasePath, 'images');
    const Videos = path.join(FileIntegrity.uploadBasePath, 'videos');
    const Other = path.join(FileIntegrity.uploadBasePath, 'other');
    const fs = require('fs');
    let ImagesSize = 0;
    let VideosSize = 0;
    let OtherSize = 0;
    if (fs.existsSync(Images)) {
      ImagesSize = this.getFolderSize(Images);
    }
    if (fs.existsSync(Videos)) {
      VideosSize = this.getFolderSize(Videos);
    }
    if (fs.existsSync(Other)) {
      OtherSize = this.getFolderSize(Other);
    }

    const result = {
      Images: ImagesSize,
      Videos: VideosSize,
      Other: OtherSize,
    };

    return JSON.stringify(result);
  }

  getFolderSize(Other: string): number {
    const fs = require('fs');
    let size = 0;
    const files = fs.readdirSync(Other);
    for (const file of files) {
      const filePath = path.join(Other, file);
      const stat = fs.statSync(filePath);
      size += stat.size;
    }
    return size;
  }

}
