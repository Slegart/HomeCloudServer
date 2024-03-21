import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SettingsModule } from '@app/settings/settings.module';

@Module({
    imports: [
      JwtModule.register({
        global: true,
        secret: process.env.SECRET,
      }),
      SettingsModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
  })
  export class AuthModule {}