import { diskStorage } from 'multer';

export const multerConfig = {
    storage: diskStorage({
      destination: './uploads', 
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