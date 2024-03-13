import { SettingsService } from './settings.service';
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { SettingsDto } from './SettingsDto';

@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @Post('SetSettings')
    async SetSettings(@Body(ValidationPipe) newSettings: SettingsDto): Promise<string> {
        return this.settingsService.SetSettings(newSettings);
    }
}
