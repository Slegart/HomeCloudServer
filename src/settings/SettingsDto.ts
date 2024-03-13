import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsBooleanString } from 'class-validator';

export class SettingsDto {
    readonly IsThumbnailEnabled: boolean
}