import { diskStorage } from 'multer';
var fs = require('fs');
export const multerConfig = {

  storage: diskStorage({
    destination: (req, file, callback) => {
      const mimetype = file.mimetype.split('/')[1];
      console.log('mimetype:', mimetype);

      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads', { recursive: true });
      }
      if (!fs.existsSync('uploads/images')) {
        fs.mkdirSync('uploads/images', { recursive: true });
      }
      if (!fs.existsSync('uploads/videos')) {
        fs.mkdirSync('uploads/videos', { recursive: true });
      }
      if (!fs.existsSync('uploads/other')) {
        fs.mkdirSync('uploads/other', { recursive: true });
      }

      if (mimetype === 'jpeg' || mimetype === 'png' || mimetype === 'jpg') {
        callback(null, 'uploads/images');
      } else if (mimetype === 'mp4' || mimetype === 'mov') {
        callback(null, 'uploads/videos');
      } else if (
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
        callback(null, 'uploads/other');
      }
    },
    filename: (req, file, callback) => {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');

      const uniqueSuffix = '-' + Math.round(Math.random() * 1e9) + '.' + file.mimetype.split('/')[1];
      const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
      const fullFilename = `${formattedDate}${uniqueSuffix}`;

      callback(null, fullFilename);
    },
  }),
}; 