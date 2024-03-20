import { AuthDTO } from '@app/auth/auth.model';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { FileIntegrity } from '@app/FileIntegrity';
import * as fs from 'fs';
import { SettingsService } from '@app/settings/settings.service';
import { exec } from 'child_process';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class SshService {
    private readonly fileIntegrity = new FileIntegrity();

    constructor(
        private readonly settingservice: SettingsService,
        private eventEmitter: EventEmitter2
    ) { }

    async InitialConnection(req: any): Promise<any> {
        const HTTPS = (JSON.parse(fs.readFileSync(FileIntegrity.SettingsFile, 'utf-8')).HTTPSEnabled);
        console.log('HTTPS:', HTTPS);
        try {
            await this.fileIntegrity.CheckFileLocations();
            if (HTTPS) {
                //await SelfSignedCert()
                
                const certData = fs.readFileSync(FileIntegrity.CertificatePath + '/cert.pem', 'utf8');
                const message = "Certificate successfully generated";
    
                const responsePayload = {
                    certificate: certData,
                    message: message
                };
    
                req.res.setHeader('Content-Type', 'application/json');
                return JSON.stringify(responsePayload);
            }
            
            
            
            else {
                const currentSettings = await this.settingservice.GetSettings();
                console.log('Current Settings:', currentSettings);
                const newSettings = {
                    ...currentSettings,
                    HTTPSEnabled: false,
                    InitialConnectionFinished: true
                };
                await this.settingservice.SetSettings(newSettings);
            }
           return 'Initial Connection Finished';

        }
        catch (e) {
          return e;
        }
    }

    async SelfSignedCert() {
        const passphrase = process.env.CERT_PASSPHRASE;
            
        const KeyCreate = `openssl genrsa -aes256 -passout pass:${passphrase} -out ${FileIntegrity.CertificatePath}/key.pem 4096`;
    
        const CertCreate = `openssl req -new -x509 -key ${FileIntegrity.CertificatePath}/key.pem -passin pass:${passphrase} -out ${FileIntegrity.CertificatePath}/cert.pem -days 365 -subj "/C=US/ST=State/L=City/O=Organization/OU=Organizational Unit/CN=example.com"`;
    
        const { exec } = require('child_process');

        await exec(KeyCreate, async (err: any, stdout: any, stderr: any) => {
            if (err) {
                console.error(err);
                return;
            }
    
            await exec(CertCreate, async (err: any, stdout: any, stderr: any) => {
                if (err) {
                    console.error(err);
                    return;
                }
    
                console.log("out openssl: ", stdout);
                const currentSettings = await this.settingservice.GetSettings();
                console.log('Current Settings:', currentSettings);
                const newSettings = {
                    ...currentSettings,
                    HTTPSEnabled: true,
                    InitialConnectionFinished: true,
                };
                await this.settingservice.SetSettings(newSettings);
            });
        });
    }

    async RestartServer(req:Request,Port:number):Promise<string> {
        try {
            console.log('Restarting server');
            console.log('Port:', Port);
            const resMessage=  this.eventEmitter.emit('Restart',Port);
            if(resMessage)
            {
                const currentSettings = await this.settingservice.GetSettings();
                const newSettings = {
                    ...currentSettings,
                    Port: Port,
                };
                await this.settingservice.SetSettings(newSettings);
                return 'Server Restarted';
            }
        } catch (error) {
            console.error('Error restarting server:', error);
        }
    }
    
}
