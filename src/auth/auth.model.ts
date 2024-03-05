import { ValidationPipe } from "@nestjs/common";
export interface AuthDTO {
    username: string;
    password: string;
}