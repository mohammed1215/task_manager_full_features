import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AppModule } from '../app.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { refreshJwtStrategy } from './refresh-jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, refreshJwtStrategy],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AppModule),
    PassportModule,
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}
