import { AuthDTO } from '@app/auth/auth.model';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { FileIntegrity } from '@app/FileIntegrity';
import * as fs from 'fs';
import { SettingsService } from '@app/settings/settings.service';
@Injectable()
export class SshService {
    private readonly fileIntegrity = new FileIntegrity();

    constructor(
        private readonly authService: AuthService,
        private readonly settingservice: SettingsService
        
        ) {}

    async InitialConnection(res: any,AuthDTO:AuthDTO,HTTPS:boolean) {
     const LoginStatus = await this.authService.login(AuthDTO);
        if(LoginStatus.message==='Login successful')
        {
            await this.fileIntegrity.CheckFileLocations();
            if(HTTPS)
            {
                const CertCreate = "openssl req -x509 -newkey rsa:4096 -keyout " + FileIntegrity.CertificatePath + "/key.pem -out " + FileIntegrity.CertificatePath + "/cert.pem -days 365";
                const { exec } = require('child_process');
                await exec(CertCreate, async (err: any, stdout: any, stderr: any) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log(stdout);
                    const currentSettings = this.settingservice.GetSettings();
                    const newSettings = {
                        ...currentSettings,
                        HTTPSEnabled: true,
                        InitialConnectionFinished: true
                    };
                    await this.settingservice.SetSettings(newSettings);

                });
            }
            else
            {
                const currentSettings = this.settingservice.GetSettings();
                const newSettings = {
                    ...currentSettings,
                    InitialConnectionFinished: true
                };
                await this.settingservice.SetSettings(newSettings);
            }
            return 'Initial Connection Finished';
            
        }
        else
        {
            return 'Login Failed';
        }
    }
}
