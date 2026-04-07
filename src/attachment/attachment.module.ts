import { InternalServerErrorException, Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { MulterModule } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import fs from 'fs'
import { randomUUID } from 'crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Task } from 'src/task/entities/task.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  controllers: [AttachmentController],
  providers: [AttachmentService],
  imports: [MulterModule.register({
    storage:  diskStorage({
       destination(req, file, callback) {
        if(!fs.existsSync('./upload')){
          fs.mkdirSync('./upload')
        }
        if(!fs.existsSync('./upload/attachments')){
          fs.mkdirSync('./upload/attachments')
        }
        callback(null,'./upload/attachments')
      },
      filename(req, file, callback) {
        const filename = `${randomUUID()}_${Date.now()}_${Math.floor(Math.random()*1000000)}.${file.mimetype.split('/')[1]}`
        callback(null,filename)
      },
    }),
    fileFilter(req, file, callback) {
      if(!['jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip'].includes(file.mimetype.split('/')[1])){
        console.log(file)
        callback(new Error(`Allowed Files are ['jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip']`),false)
        return
      }

      if(file.size > 10 * 1024 * 1024){
        callback(new Error(`max file size 10MB`),false)
      }

      callback(null,true)
    },

  }),
  TypeOrmModule.forFeature([Attachment,Task,BoardMember,Activity,WorkspaceMember]),
  CloudinaryModule,
]
})
export class AttachmentModule {}
