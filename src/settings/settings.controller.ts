import { SettingsService } from './settings.service';
import { Controller, Post, Body, Session, ValidationPipe, UseGuards, Req,HttpCode,Get,HttpStatus,Request, Headers } from '@nestjs/common';

import { AuthGuard } from 'src/authguard/auth.guard';

@Controller('settings')
export class SettingsController {
    constructor(private settingsService:SettingsService) {}

    @Get('SetSettings')
    //@UseGuards(AuthGuard)
    async SetSettings(): Promise<string>
    {
        return this.settingsService.SetSettings();
    }
}
