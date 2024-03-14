import { SettingsService } from './settings.service';
import { Controller, Post, Body, ValidationPipe, Get, UseGuards } from '@nestjs/common';
import { SettingsDto } from './SettingsDto';
import { AuthGuard } from '@app/authguard/auth.guard';
@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @Post('SetSettings')
    async SetSettings(@Body(ValidationPipe) newSettings: SettingsDto): Promise<string> {
        return this.settingsService.SetSettings(newSettings);
    }
    @UseGuards(AuthGuard)
    @Get('GetSettings')
    async GetSettings(): Promise<JSON> {
        return this.settingsService.GetSettings();
    }
}
