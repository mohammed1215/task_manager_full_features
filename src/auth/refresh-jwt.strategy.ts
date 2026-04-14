import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from '../interface/jwt-payload.interface';
import { type Request } from 'express';

@Injectable()
export class refreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.getOrThrow('JWT_REFRESH_SECRET'),

      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: jwtPayload) {
    const { refreshToken } = req.body as { refreshToken: string };
    console.log('VALIDATING REFRESH_TOKEN');
    return { ...payload, refreshToken };
  }
}
