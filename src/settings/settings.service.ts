import { Injectable } from '@nestjs/common';
import { FileIntegrity } from '@app/FileIntegrity';
import { Console } from 'console';
import * as fs from 'fs';
@Injectable()
export class SettingsService {
    private readonly fileIntegrity = new FileIntegrity();

    async SetSettings(SettingsDto): Promise<string> {
        await this.fileIntegrity.CheckSettingJson();
        console.log('SettingsDto:', SettingsDto);
        fs.writeFileSync(FileIntegrity.SettingsFile, JSON.stringify(SettingsDto));
        return 'Success';
    }
}
