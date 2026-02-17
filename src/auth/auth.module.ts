import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AppModule } from 'src/app.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [forwardRef(()=>UserModule),forwardRef(()=>AppModule),PassportModule],
})
export class AuthModule {}
