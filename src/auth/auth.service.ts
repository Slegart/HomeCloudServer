import { Injectable } from '@nestjs/common';
import { AuthDTO } from './auth.model';
@Injectable()
export class AuthService {
     constructor(){

     }

    Login(authDTO:AuthDTO): boolean {
        if(authDTO.username === 'admin' && authDTO.password === 'admin'){
            return true;
        }
        return false;
    }
}
