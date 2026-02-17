import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UploadedFiles, UseInterceptors, MaxFileSizeValidator, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }

  @Get('me')
  @UseGuards(JwtGuard)
  findMe(@User() user:jwtPayload){
    console.log(user)
    return this.userService.findOne(user.userId)
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@User() user:jwtPayload,@Body() updateProfileDto:UpdateProfileDto){
    return {message:await this.userService.updateProfile(user.userId,updateProfileDto)}
  }

  @Post('me/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@User() user:jwtPayload, @UploadedFile(new ParseFilePipe({fileIsRequired:true,validators:[
    new MaxFileSizeValidator({maxSize:5*1024*1024}),
  ]})) file:Express.Multer.File){
    return  this.userService.uploadAvatar(user.userId,file)
  }
}
