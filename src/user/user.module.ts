import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service.ts';
import { UserController } from './user.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.ts';
import { AuthModule } from '../auth/auth.module.ts';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { Activity } from '../activity/entities/activity.entity.ts';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.ts';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Activity]),
    forwardRef(() => AuthModule),
    MulterModule.register({
      storage: multer.diskStorage({
        destination(req, file, callback) {
          console.log('📂 Target Destination: ./upload');
          const uploadPath = './upload';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, './upload');
        },
        filename(req, file, callback) {
          const time = Date.now();
          const randomString = Math.floor(Math.random() * 1000000);
          const filename = `${randomString}_${time}_${file.originalname}`;
          console.log('📄 Generated Filename:', filename); // Check if name is valid
          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        if (file.mimetype.split('/')[0] !== 'image') {
          console.error('❌ Rejected: Not an image');
          callback(new BadRequestException('not allowed file type'), false);
          return;
        }
        console.log('✅ Accepted: File is an image');
        callback(null, true);
      },
    }),
    CloudinaryModule,
  ],
})
export class UserModule {}
