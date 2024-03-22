import { diskStorage } from 'multer';
import { FileIntegrity } from '@app/FileIntegrity';
import * as path from 'path';
import * as fs from 'fs';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = FileIntegrity.uploadBasePath;
      const mimetype = file.mimetype.split('/')[1];

      const imageDestination = `${uploadPath}/images`;
      const videoDestination = `${uploadPath}/videos`;
      const otherDestination = `${uploadPath}/other`;

      ensureDirectoryExists(imageDestination);
      ensureDirectoryExists(videoDestination);
      ensureDirectoryExists(otherDestination);

      let destination;
      if (mimetype === 'jpeg' || mimetype === 'png' || mimetype === 'jpg') {
        destination = imageDestination;
      } else if (mimetype === 'mp4' || mimetype === 'mov') {
        destination = videoDestination;
      }  else if (
        mimetype === 'pdf' ||
        mimetype === 'docx' ||
        mimetype === 'txt' ||
        mimetype === 'xlsx' ||
        mimetype === 'pptx' ||
        mimetype === 'csv' ||
        mimetype === 'zip' ||
        mimetype === 'rar' ||
        mimetype === '7z' ||
        mimetype === 'tar' ||
        mimetype === 'gz' ||
        mimetype === 'bz2' ||
        mimetype === 'xz' ||
        mimetype === 'xml') {
        destination = otherDestination;
      }

      callback(null, destination);
    },
    filename: (req, file, callback) => {
      const currentDate = new Date();
      const uniqueFilename = `${currentDate.getTime()}_${file.originalname}`;

      callback(null, uniqueFilename);
    },
  }),
};

function ensureDirectoryExists(directory: string) {
  directory = path.join(directory);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
