import { ClassSerializerInterceptor, forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { UserModule } from './user/user.module.ts';
import { WorkspaceModule } from './workspace/workspace.module.ts';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity.ts';
import { Workspace } from './workspace/entities/workspace.entity.ts';
import { WorkspaceMember } from './workspace-member/entities/workspace-member.entity.ts';
import { AuthModule } from './auth/auth.module.ts';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from './mail/mail.service.ts';
import { JwtProviderService } from './jwt-provider/jwt-provider.service.ts';
import {PassportModule} from '@nestjs/passport'
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { Invitation } from './workspace/entities/invitation.entity.ts';
import { BoardModule } from './board/board.module.ts';
import { ColumnModule } from './column/column.module.ts';
import { Board } from './board/entities/board.entity.ts';
import { ColumnEntity } from './column/entities/column.entity.ts';
import { BoardMember } from './board/entities/board-member.entity.ts';
import { TaskModule } from './task/task.module.ts';
import { Task } from './task/entities/task.entity.ts';
import { CommentModule } from './comment/comment.module.ts';
import { AttachmentModule } from './attachment/attachment.module.ts';
import { TagModule } from './tag/tag.module.ts';
import { ActivityModule } from './activity/activity.module.ts';
import { NotificationModule } from './notification/notification.module.ts';
import { TaskAssigneeModule } from './task-assignee/task-assignee.module.ts';
import { TaskTagsModule } from './task-tags/task-tags.module.ts';
import { TaskWatcherModule } from './task-watcher/task-watcher.module.ts';
import { Tag } from './tag/entities/tag.entity.ts';
import { TaskAssignee } from './task-assignee/entities/task-assignee.entity.ts';
import { TaskWatcher } from './task-watcher/entities/task-watcher.entity.ts';
import { Comment } from './comment/entities/comment.entity.ts';
import { Activity } from './activity/entities/activity.entity.ts';
import { Attachment } from './attachment/entities/attachment.entity.ts';
import { Notification } from './notification/entities/notification.entity.ts';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SearchModule } from './search/search.module.ts';
import { CloudinaryModule } from './cloudinary/cloudinary.module.ts';
@Module({
  imports: [UserModule ,forwardRef(()=>WorkspaceModule), WorkspaceMemberModule,ConfigModule.forRoot({
    isGlobal:true
  }),
  TypeOrmModule.forRootAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>{
      return {
        type:'postgres',
        url: config.get<string>('DATABASE_CONNECTION_STRING'),
        synchronize:true,
        entities: [User,Workspace,WorkspaceMember,Invitation,Board,ColumnEntity,BoardMember,Task,Tag,TaskAssignee,TaskWatcher,Comment,Activity,Attachment,Notification]
      }
    }
  }), 
  AuthModule,
  JwtModule.registerAsync({
    global:true,
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>{
      return{
        secret:config.get<string>('JWT_SECRET'),
        signOptions:{
          expiresIn:'1h'
        }
      }
    }
  }), MailerModule.forRootAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>{
      return {
        transport: {
          service: config.get<string>('MAIL_SERVICE'),
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: config.get<boolean>('MAIL_SECURE'), // Use true for 465, false for other ports (like 587)
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
        }
      }
      }
    }
  }),
  MulterModule.register({
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
        callback(new Error('not allowed file type'),false)
        return
      }
      if(file.size > 5 * 1024 * 1024){
        console.error('❌ Rejected: Max Size 5MB');
        callback(new Error('file size max 5MB'),false)
        return
      }
      console.log('✅ Accepted: File is an image');
      callback(null,true)
    },
  }),
  BoardModule,
  ColumnModule,
  TaskModule,
  CommentModule,
  AttachmentModule,
  TagModule,
  ActivityModule,
  NotificationModule,
  TaskAssigneeModule,
  TaskTagsModule,
  TaskWatcherModule,
  EventEmitterModule.forRoot(),
  ScheduleModule.forRoot(),
  SearchModule,
  CloudinaryModule
],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }, MailService, JwtProviderService],
  exports: [MailService,JwtProviderService]
})
export class AppModule {}
