import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {

    SetSettings(): string {
        return 'Settings set successfully';
    }
}
