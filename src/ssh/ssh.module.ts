import { Module } from '@nestjs/common';
import { SshController } from './ssh.controller';
import { SshService } from './ssh.service';
import { AuthModule } from '@app/auth/auth.module';
import { SettingsModule } from '@app/settings/settings.module';

@Module({
  imports:[AuthModule,SettingsModule],
  controllers: [SshController],
  providers: [SshService]
  
})
export class SshModule {}
