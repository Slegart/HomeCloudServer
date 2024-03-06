import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [AuthModule, MediaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

  ],
  controllers: [AppController, AuthController ],
  providers: [AppService, ],

})
export class AppModule {}
