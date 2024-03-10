import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //console.log('request:', request);
    let token = this.extractTokenFromHeader(request);
    //direct acess through href Bearer header
    //potential security risk might change later
    if(token === undefined){
      try
      {
        const hrefLink = request._parsedOriginalUrl.href;
        const keyword = '&Bearer' 
        const index = hrefLink.indexOf(keyword);
        if(index !== -1)
        {
          token = hrefLink.substring(index + keyword.length);
        }
      }
      catch
      {
        throw new UnauthorizedException('Missing token');
      }
    }
    console.log('token:', token);
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (this.isTokenExpired(payload.exp)) {
        throw new UnauthorizedException('Token has expired');
      }

     
      request['user'] = { username: payload.username }; 
      if(request['user'].username !== process.env.UNAME){
        console.log("Unauthorized access")
        throw new UnauthorizedException('Invalid token');
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isTokenExpired(expirationTime: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000); 
    return expirationTime < currentTimestamp;
  }
}
