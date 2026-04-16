import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    handleRequest<TUser = any>(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
        status?: any,
    ): TUser {
        if (err || !user) {
            console.log('Guard Error:', err);
            console.log('Passport Info:', info); // This often contains "jwt expired" or "no auth token"
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
