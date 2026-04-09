import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.ts';
import { AuthService } from './auth.service.ts';
import { UserModule } from '../user/user.module.ts';
import { AppModule } from '../app.module.ts';
import { JwtStrategy } from './jwt.strategy.ts';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [forwardRef(()=>UserModule),forwardRef(()=>AppModule),PassportModule],
})
export class AuthModule {}
