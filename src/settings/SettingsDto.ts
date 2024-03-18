import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsBooleanString } from 'class-validator';

export class SettingsDto {
    readonly IsThumbnailEnabled: boolean
    readonly isFullSizeImagesEnabled: boolean
    readonly sessionDuration: number
    readonly HTTPSEnabled: boolean
    readonly InitialConnectionFinished: boolean
    readonly port: number
}