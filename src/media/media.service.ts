import { Injectable } from '@nestjs/common';


@Injectable()
export class MediaService {
    constructor(){  }

    uploadFile(file: Express.Multer.File): string {
        

        const MimeType = file.mimetype.split('/')[1];
        console.log("file type: ",MimeType)

        const filepath = 'uploads/' + file.filename;
        console.log(`File ${file.originalname} uploaded successfully. File path is ${filepath}`);
        console.log("file type: ",file.mimetype)
        return `File ${file.originalname} uploaded successfully. File path is ${filepath}`;
      }

      FetchFilesLength(): string {
          const filepath = 'uploads/';
          const FileCount = filepath.length
          // console.log(`File ${file} fetched successfully.`);
          // return `File ${file} fetched successfully.`;
          return `File count is ${FileCount}`;
      }
}
