import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account and send verification email',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Verification email sent.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      message: 'user registered successfully please verify your email',
      userId: user.id,
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Login with email and password to receive JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return { ...result, expiresIn: 1 * 60 * 60 * 1000, tokenType: 'Bearer' };
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset link to user email',
  })
  @ApiResponse({ status: 200, description: 'Reset link sent to email' })
  @ApiResponse({ status: 400, description: 'Email is required' })
  @ApiBody({
    schema: {
      properties: { email: { type: 'string', example: 'user@example.com' } },
    },
  })
  async forgotPassword(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email must be provided');
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Set new password using reset token',
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or password not provided',
  })
  @ApiQuery({
    name: 'token',
    type: 'string',
    description: 'Reset token from email',
  })
  @ApiQuery({ name: 'id', type: 'string', description: 'User ID' })
  @ApiBody({
    schema: {
      properties: { password: { type: 'string', example: 'newPassword123' } },
    },
  })
  async resetPassword(
    @Query('token') resetToken: string,
    @Query('id') userId: string,
    @Body('password') password: string,
  ) {
    if (!password) throw new BadRequestException('password must be provided');
    return this.authService.resetPassword(resetToken, userId, password);
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify user email using token sent to email',
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  @ApiQuery({
    name: 'token',
    type: 'string',
    description: 'Verification token from email',
  })
  @ApiQuery({ name: 'id', type: 'string', description: 'User ID' })
  async verifyEmail(
    @Query('token') verifyToken: string,
    @Query('id') userId: string,
  ) {
    return this.authService.verifyEmail(verifyToken, userId);
  }

  /**User can request password reset via email
    System sends reset link valid for 1 hour
    Reset link is single-use only
    User can set new password meeting security requirements
    User receives confirmation email after successful reset
 */
}
