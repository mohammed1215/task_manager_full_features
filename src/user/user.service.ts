import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.ts';
import { UpdateUserDto } from './dto/update-user.dto.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.ts';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { UpdateProfileDto } from './dto/update-profile.dto.ts';
import { ConfigService } from '@nestjs/config';
import fs from 'fs'
import { Activity } from '../activity/entities/activity.entity.ts';
import { CloudinaryService } from '../cloudinary/cloudinary.service.ts';
import { unlink } from 'fs/promises';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private readonly config:ConfigService,
    @InjectRepository(Activity) private readonly activityRepo:Repository<Activity>,
    private readonly cloudinaryService:CloudinaryService
  ){}

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

    //activity
    const activity = this.activityRepo.create({
      actor: {id: userId},
      fieldName: 'updated user profile',
      oldValue: JSON.stringify(user),
      newValue: result.raw
    })

    await this.activityRepo.save(activity)

    //return updated successfully message
    return "updated profile data successfully"
  }

  async uploadAvatar(userId:string,file:Express.Multer.File){
    let newProfileUrl:string;
    try {
        
      // check if file exists or not
      if(!file){
        throw new BadRequestException('avatar is required')
      }
        
      //get old url
      let user = await this.findOne(userId)
      const oldUrl = user.avatarUrl

      //delete the file
      if(oldUrl){
        await this.deleteOldImage(oldUrl)
      }

      if(this.cloudinaryService.isCloudinaryEnabled()){
        const result = await this.cloudinaryService.upload(file)
        newProfileUrl = result.url
      }else{
        newProfileUrl=`${this.config.get<string>('BACKEND_URL')}/images/${file?.filename}`
      }
      
      
      // save new user avatar Url
      user = await this.userRepo.save({...user, avatarUrl: newProfileUrl})

      //return updated successfully message
      return {message:"updated profile avatar successfully",user}
    } catch (error) {
      if (file?.path && fs.existsSync(file.path)) {
        await this.deleteLocalFile(file.path);
      }
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async deleteOldImage(path:string){
    const filename = path.split('/').at(-1)?.split('.')[0]??'';
    if(this.cloudinaryService.isCloudinaryEnabled()){
      await this.cloudinaryService.deleteProfile(filename)
      return 'deleted successfully'
    }else{
      try {
        await unlink(`./upload/${filename}`);
        console.log('deleted successfully');
        return 'deleted successfully';
      } catch (err) {
        console.log(err);
        // Do not throw an error if the file just doesn't exist anymore, just ignore it
        if (err.code !== 'ENOENT') { 
          throw new InternalServerErrorException(err.message);
        }
      }
    }
  }

  private async deleteLocalFile(filePath:string){
    try {
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting local file:', error);
    }
  }
}
