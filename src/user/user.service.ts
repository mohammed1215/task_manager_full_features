import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ConfigService } from '@nestjs/config';
import fs from 'fs'
@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepo:Repository<User>,private readonly config:ConfigService){}

  async create(createUserDto: CreateUserDto) {
    // check if email exists or not
    const result = await this.findUserByEmail(createUserDto.email)
    if(result) throw new ConflictException('email is used')

    // hash password
    createUserDto.password = await bcrypt.hash(createUserDto.password,10)

    //create user
    const user = this.userRepo.create(createUserDto)

    //save in db
    return this.userRepo.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

 async findOne(userId: string) {
    const user =await  this.userRepo.findOne({where:{id:userId},relations:['sentInvitations','receivedInvitation','memberships']});
    if(!user) {throw new NotFoundException('user not found')}
    return user
  }
  
  findUserByEmail(email:string){
    return this.userRepo.findOne({where:{email}})
  }
  
  async updateEmailVerification(userId:string){
    const result = await this.userRepo.update({id:userId},{
      emailVerified:true
    })
    if(result.affected === 0) throw new NotFoundException('user not found')
    return 'email has been verified successfully'
  }

  async updatePassword(userId:string,password:string){
    const result = await this.userRepo.update({id:userId},{
      password
    })
    if(result.affected === 0) throw new NotFoundException('user not found')
    return  result
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  
  async updateProfile(userId:string, updateProfileDto:UpdateProfileDto){

    //find old user
    const user = await this.findOne(userId)

    if(updateProfileDto.currentPassword && updateProfileDto.newPassword){
      //compare current password with old password
      const result = await bcrypt.compare(updateProfileDto.currentPassword,user.password)
      if(!result) throw new BadRequestException('password is incorrect');
      
      //hash new password
      const hash = await bcrypt.hash(updateProfileDto.newPassword,10)

      // update user password
      user.password = hash;
    }

    delete updateProfileDto.currentPassword
    delete updateProfileDto.newPassword

    //use userId to find the user and update it with the new data in update profile dto variable
    const result = await this.userRepo.update({id:userId},{...user,...updateProfileDto})
    
    //if no affected data then user couldn't be found
    if(!result.affected) throw new NotFoundException('user not found')

    //return updated successfully message
    return "updated profile data successfully"
  }

  async uploadAvatar(userId:string,file:Express.Multer.File){
    // check if file exists or not
    if(!file){
      throw new BadRequestException('avatar is required')
    }

    //get old url
    let user = await this.findOne(userId)
    const oldUrl = user.avatarUrl

     // delete the file
    await this.deleteOldImage(`./upload/${oldUrl?.split('/').at(-1)}`)
    
    // save new user avatar Url
    user = await this.userRepo.save({...user, avatarUrl: `${this.config.get<string>('BACKEND_URL')}/images/${file?.filename}`})

    //return updated successfully message
    return {message:"updated profile avatar successfully",user}
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private deleteOldImage(path:string){
   
    return new Promise((resolve,reject)=>{
      fs.unlink(path,(err)=>{
        if(err){
          console.log(err)
          throw new InternalServerErrorException(`${err?.message}`)
        }
        console.log('deleted successfully')
        resolve('deleted successfully')
    })
    })
  }
}
