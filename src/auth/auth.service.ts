import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './auth.model';
import { JwtService } from '@nestjs/jwt';
import { FileIntegrity } from '@app/FileIntegrity';
import * as fs from 'fs';
import { SettingsService } from '@app/settings/settings.service';
import { SettingsDto } from '@app/settings/SettingsDto';
import * as bcrypt from 'bcrypt';
const crypto = require('crypto');
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly settingservice: SettingsService
  ) { }
  private readonly FileIntegrity = new FileIntegrity();

  async login({
    username,
    password,
  }: AuthDTO): Promise<{
    success: boolean;
    message?: string;
    access_token?: string;
  }> {
    if (await this.FileIntegrity.CheckFileLocations()) {
      console.log('File locations checked');
    }
    console.log('Username:', username);
    console.log('Password:', password);

    if (username === JSON.parse(fs.readFileSync(FileIntegrity.AuthPath, 'utf-8')).username
      && password === await this.decrypt(JSON.parse(fs.readFileSync(FileIntegrity.AuthPath, 'utf-8')).HashedPassword)) {

      const payload = { username };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: JSON.parse(fs.readFileSync(FileIntegrity.SettingsFile, 'utf-8')).sessionDuration,
      });
      console.log('access_token:', access_token);
      return {
        success: true,
        message: 'Login successful',
        access_token,
      };
    }
    else {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid username or password',
      });
    }
  }

  async register({
    username,
    password,
  }: AuthDTO): Promise<{
    success: boolean;
    message?: string;
    access_token?: string;
  }> {
    try {
      const HashedPassword = await this.encrypt(password);
      fs.writeFileSync(FileIntegrity.AuthPath, JSON.stringify({ username, HashedPassword }));
      const payload = { username };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: JSON.parse(fs.readFileSync(FileIntegrity.SettingsFile, 'utf-8')).sessionDuration,
      });
      console.log('access_token:', access_token);
      return {
        success: true,
        message: 'Login successful',
        access_token,
      };
    } catch (error) {
      console.error('Error during registration:', error);
      return {
        success: false,
        message: 'Error during registration',
      };
    }
  }

  async encrypt(text: string) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.HASH_SECRET);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log('encrypted:', encrypted);
    return encrypted;
  }

  async decrypt(encryptedText: string) {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.HASH_SECRET);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log('decrypted:', decrypted);
    return decrypted;
  }

  async verifyToken(tokenObj: string): Promise<string> {
    try {

      console.log('token', tokenObj);

      const payload = await this.jwtService.verifyAsync(tokenObj, {
        secret: process.env.JWT_SECRET,
      });

      if (payload) {
        return 'Valid Token';

      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return 'Invalid Token';
    }
  }

  async CheckConnection() {
    const settings = await this.settingservice.GetSettingsDTO();

    if (settings.InitialConnectionFinished === false) {
      return 'InitialConnection';
    } else {
      return 'Connected';
    }

  }

}
