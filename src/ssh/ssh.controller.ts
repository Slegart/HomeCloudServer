import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SshService } from './ssh.service';
import { AuthDTO } from 'src/auth/auth.model';
@Controller('ssh')
export class SshController {
    constructor(private sshService: SshService) {}
    @Get('initialconnection')
    async FirstConnection(@Req() req: any,@Body() AuthDTO: AuthDTO,@Body()HTTPS:boolean): Promise<string> {
        return await this.sshService.InitialConnection(req,AuthDTO,HTTPS);
    }
}
