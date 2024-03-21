import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('request:', request.headers);
    let token =request.headers.authorization;
    if(token === undefined){
     token = this.extractTokenFromHeader(request);
     console.log("hardcoded token:", token)
    }
    else
    {
      token = token.replace('Bearer ', '');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('payload:', payload);
    }

    console.log("Authorized access")
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    console.log('request.headers.authorization:', request.query);
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isTokenExpired(expirationTime: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000); 
    return expirationTime < currentTimestamp;
  }
}
