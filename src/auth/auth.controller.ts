import { Controller, Post, Body, Session, ValidationPipe, UseGuards, Req,HttpCode,Get,HttpStatus,Request, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './auth.model';
import { AuthGuard } from 'src/authguard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() AuthDTO: AuthDTO, @Session() session: any ){
    return this.authService.login(AuthDTO);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Get('Connection')
  CheckConnection(){
    return 'Connected';
  }

  @Post('verify')
  async verifyToken(@Headers('authorization') authorization: string): Promise<string>{
    const token = authorization.replace('Bearer ', '');
    return this.authService.verifyToken(token);
  }
}