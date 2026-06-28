import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtProviderService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}
    async generateVerificationToken(payload: any) {
        return this.jwtService.signAsync(payload, {
            secret: this.config.get<string>('VERIFICATION_SECRET_KEY'),
            expiresIn: '1h',
        });
    }

    async generateAccessToken({
        userId,
        email,
    }: {
        userId: string;
        email: string;
    }) {
        return this.jwtService.signAsync({
            userId,
            email,
        });
    }

    async generateRefreshToken({
        userId,
        email,
    }: {
        userId: string;
        email: string;
    }) {
        return this.jwtService.signAsync(
            { userId, email },
            {
                expiresIn: '30d',
                secret: this.config.get('JWT_REFRESH_SECRET'),
            },
        );
    }
}
