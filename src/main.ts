import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { FileIntegrity } from './FileIntegrity';
import { SettingsService } from './settings/settings.service';
import { SettingsDto } from './settings/SettingsDto';
import { SshService } from './ssh/ssh.service';
import { EventEmitter2 } from '@nestjs/event-emitter';


async function bootstrap() {

  const fileIntegrity = new FileIntegrity();
  await fileIntegrity.CheckFileLocations();
  await fileIntegrity.CheckSettingJson();
  await fileIntegrity.CheckAuthJson();

  const settingservice = new SettingsService();
  const sshservice = new SshService(settingservice, null)
  let Port = 5000; 
  let settings = JSON.parse(fs.readFileSync(FileIntegrity.SettingsFile, 'utf8'));
  let UseHTTPS = false;
  if (settings) {
    if (settings.InitialConnectionFinished === false) {
      const defaultSettings: SettingsDto = {
        IsThumbnailEnabled: false,
        isFullSizeImagesEnabled: false,
        sessionDuration: 10000,
        HTTPSEnabled: false,
        InitialConnectionFinished: false,
        port: Port,
      };
      UseHTTPS = defaultSettings.HTTPSEnabled;
      await settingservice.SetSettings(defaultSettings);

    }
    else
    {
      UseHTTPS = settings.HTTPSEnabled;
      Port = parseInt(settings.Port);
      if(Number.isNaN(Port))
      {
        Port = 5000;
      }
    }
  }
  let app = await NestFactory.create(AppModule, {
    ...(UseHTTPS && {
      httpsOptions: {
        key: fs.readFileSync(FileIntegrity.CertificatePath + '/key.pem'),
        cert: fs.readFileSync(FileIntegrity.CertificatePath + '/cert.pem'),
        passphrase: process.env.CERT_PASSPHRASE,
      },
    }),
  });
  const eventEmitter = app.get(EventEmitter2);
  const server = await app.listen(Port);
  console.log('Server listening on port:', Port);

  eventEmitter.on('Restart', async (Port) => {
    console.log('changing port');
    await server.close();
    app = await NestFactory.create(AppModule, {});
    await app.listen(Port); 
    console.log('Server port updated to:', Port);
    return Port;
  });

  eventEmitter.on('Shutdown', async () => {
    console.log('Shutting down server');
    await server.close();
    process.exit(0);
  });

}

bootstrap();