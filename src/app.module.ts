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
import { SshModule } from './ssh/ssh.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [AuthModule, MediaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SettingsModule,
    SshModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController, AuthController, SettingsController ],
  providers: [AppService, ],

})
export class AppModule {}
