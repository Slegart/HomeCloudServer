import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './auth.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login({
    username,
    password,
  }: AuthDTO): Promise<{
    success: boolean;
    message?: string;
    access_token?: string;
  }> {
    console.log('username', username);
    console.log('password ', password);
    console.log('process.env.UNAME', process.env.UNAME);
    console.log('process.env.PASS', process.env.PASS);
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    if (username === await process.env.UNAME && password === await process.env.PASS){
      const payload = { username };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '10s', 
      });

      return {
        success: true,
        message: 'Login successful',
        access_token,
      };
    }

    throw new UnauthorizedException({
      success: false,
      message: 'Invalid username or password',
    });
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
