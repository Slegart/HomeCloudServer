import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@nestjs/common';
import { AuthDTO } from './auth.model';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    @Get('login')
    Login(@Query(ValidationPipe) authDTO: AuthDTO): boolean {
        return this.authService.Login(authDTO);
    }
}
