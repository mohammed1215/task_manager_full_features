import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtProviderService } from '../jwt-provider/jwt-provider.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
    private readonly jwtProvider: JwtProviderService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const verifyToken = await this.jwtProvider.generateVerificationToken({
      userId: user.id,
      email: user.email,
    });
    await this.mailService.sendVerificationMail(
      user.email,
      verifyToken,
      user.id,
    );
    return user;
  }

  async login(loginDto: LoginDto) {
    // find user
    const user = await this.userService.findUserByEmail(loginDto.email);

    // not found throw exception
    if (!user) throw new NotFoundException('user not found');

    // if found compare hashed password with the password
    const result = await bcrypt.compare(loginDto.password, user.password);

    // if  false throw exception password isn't correct
    if (!result) throw new BadRequestException('password is not correct');

    //check if the email is verified or not
    if (!user.emailVerified) {
      const verifyToken = await this.jwtProvider.generateVerificationToken({
        userId: user.id,
        email: user.email,
      });
      await this.mailService.sendVerificationMail(
        user.email,
        verifyToken,
        user.id,
      );
      throw new BadRequestException('Email is not verified, check your inbox');
    }

    //generate access token
    const accessToken = await this.jwtService.signAsync({
      userId: user.id,
      email: user.email,
    });

    //generate refresh token
    const refreshToken = await this.jwtService.signAsync(
      { userId: user.id, email: user.email },
      {
        expiresIn: '30d',
      },
    );

    // return the token
    return { accessToken, refreshToken, user };
  }

  async verifyEmail(verifyToken: string, userId: string) {
    //verify verification token
    const payload = await this.jwtService.verifyAsync(verifyToken, {
      secret: this.config.get<string>('VERIFICATION_SECRET_KEY'),
    });

    // check if the userId === token.userId
    if (userId !== payload.userId)
      throw new BadRequestException('not allowed user');

    //check if the user is in the database
    await this.userService.findOne(userId);

    // update user's password in the database
    await this.userService.updateEmailVerification(userId);

    //return message
    return { message: 'email has been verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new NotFoundException('user not found');

    const result = await this.mailService.sendForgotPasswordMail(
      email,
      user.id,
    );
    if (result.rejected.length > 0)
      throw new BadRequestException(`couldn't send the email try again`);
    return {
      message: 'sent reset email to user',
    };
  }

  async resetPassword(resetToken: string, userId: string, newPassword: string) {
    //validate token
    const payload = await this.jwtService.verifyAsync(resetToken, {
      secret: this.config.get<string>('RESET_SECRET_PASS'),
    });

    //check if the userId === token.userId
    if (userId !== payload.userId)
      throw new BadRequestException('not allowed user');

    //hash new Password
    const password = await bcrypt.hash(newPassword, 10);

    // update user's password in the database
    await this.userService.updatePassword(userId, password);

    // send email confirmation
    await this.mailService.sendConfirmEmailPasswordReset(payload.email);

    //return message
    return { message: 'password updated successfully' };
  }
}
