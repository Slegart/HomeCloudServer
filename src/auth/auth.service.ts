import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './auth.model';
import { JwtService } from '@nestjs/jwt';
import { FileIntegrity } from '@app/FileIntegrity';
import * as fs from 'fs';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }
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
    if (username === await process.env.UNAME && password === await process.env.PASS) {
      const payload = { username };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: JSON.parse(fs.readFileSync(FileIntegrity.SettingsFile, 'utf-8')).sessionDuration,
      });

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

}
