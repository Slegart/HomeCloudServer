import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { SettingsController } from './settings/settings.controller';
import { SettingsModule } from './settings/settings.module';
@Module({
  imports: [AuthModule, MediaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SettingsModule,

  ],
  controllers: [AppController, AuthController, SettingsController ],
  providers: [AppService, ],

})
export class AppModule {}
