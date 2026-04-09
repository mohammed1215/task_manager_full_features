import { InternalServerErrorException, Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service.ts';
import { AttachmentController } from './attachment.controller.ts';
import { MulterModule } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import fs from 'fs'
import { randomUUID } from 'crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity.ts';
import { Task } from '../task/entities/task.entity.ts';
import { BoardMember } from '../board/entities/board-member.entity.ts';
import { Activity } from '../activity/entities/activity.entity.ts';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity.ts';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.ts';
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
