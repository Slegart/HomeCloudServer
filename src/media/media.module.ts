import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../multer/multer.config'
@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
