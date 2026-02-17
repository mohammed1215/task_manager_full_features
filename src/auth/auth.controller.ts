import { BadRequestException, Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
   async register(@Body() createUserDto:CreateUserDto){
    const user = await this.authService.register(createUserDto)
        return {
            message:"user registered successfully please verify your email",
            userId: user.id
        }
    }

    @Post('login')
    async login(@Body() loginDto:LoginDto){
       const result = await this.authService.login(loginDto)
        return {...result,expiresIn: 1 * 60 * 60 * 1000,tokenType:'Bearer'}
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email:string){
        if(!email) throw new BadRequestException('Email must be provided')
        return this.authService.forgotPassword(email)
    }

    @Post('reset-password')
    async resetPassword( @Query('token') resetToken:string,@Query('id') userId:string,@Body('password') password:string){
        if(!password) throw new BadRequestException('password must be provided')
        return this.authService.resetPassword(resetToken,userId,password)
    }

    @Post('verify-email')
    async verifyEmail(@Query('token') verifyToken:string,@Query('id') userId:string){
            return this.authService.verifyEmail(verifyToken,userId)
    }

    /**User can request password reset via email
    System sends reset link valid for 1 hour
    Reset link is single-use only
    User can set new password meeting security requirements
    User receives confirmation email after successful reset
 */
}
