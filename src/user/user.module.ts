import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]),forwardRef(()=>AuthModule),  MulterModule.register({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        console.log('📂 Target Destination: ./upload');
        const uploadPath = './upload'
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        } 
        callback(null,'./upload')
      },
      filename(req, file, callback) {
        const time = Date.now()
        const randomString = Math.floor(Math.random() * 1000000)
        const filename = `${randomString}_${time}_${file.originalname}`
        console.log('📄 Generated Filename:', filename); // Check if name is valid
        callback(null,filename)
      },
    }),
    fileFilter(req, file, callback) {
      if(file.mimetype.split('/')[0] !== 'image'){
        console.error('❌ Rejected: Not an image');
        callback(new BadRequestException('not allowed file type'),false)
        return
      }
      console.log('✅ Accepted: File is an image');
      callback(null,true)
    },
  })]
})
export class UserModule {}
