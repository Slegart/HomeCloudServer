import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SshService } from './ssh.service';
import { AuthDTO } from 'src/auth/auth.model';
import { AuthGuard } from '../authguard/auth.guard';

@Controller('ssh')
export class SshController {
    constructor(private sshService: SshService) {}
    @Get('initialconnection')
    async FirstConnection(@Req() req: any): Promise<string> {
        return await this.sshService.InitialConnection(req);
    }
    @Get('RestartServer')
    async RestartServer(@Req() req: any,@Query('Port') Port: number): Promise<string> {
        return await this.sshService.RestartServer(req,Port);
    }
    @Get('shutdown')
    @UseGuards(AuthGuard)
    async ShutdownServer() {
        return await this.sshService.ShutdownServer();
    }
}
