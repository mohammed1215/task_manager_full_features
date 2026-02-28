import { ClassSerializerInterceptor, forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Workspace } from './workspace/entities/workspace.entity';
import { WorkspaceMember } from './workspace-member/entities/workspace-member.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from './mail/mail.service';
import { JwtProviderService } from './jwt-provider/jwt-provider.service';
import {PassportModule} from '@nestjs/passport'
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { Invitation } from './workspace/entities/invitation.entity';
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
import { Board } from './board/entities/board.entity';
import { ColumnEntity } from './column/entities/column.entity';
import { BoardMember } from './board/entities/board-member.entity';
import { TaskModule } from './task/task.module';
import { Task } from './task/entities/task.entity';
import { CommentModule } from './comment/comment.module';
import { AttachmentModule } from './attachment/attachment.module';
import { TagModule } from './tag/tag.module';
import { ActivityModule } from './activity/activity.module';
import { NotificationModule } from './notification/notification.module';
import { TaskAssigneeModule } from './task-assignee/task-assignee.module';
import { TaskTagsModule } from './task-tags/task-tags.module';
import { TaskWatcherModule } from './task-watcher/task-watcher.module';
import { Tag } from './tag/entities/tag.entity';
import { TaskAssignee } from './task-assignee/entities/task-assignee.entity';
import { TaskWatcher } from './task-watcher/entities/task-watcher.entity';
import { Comment } from './comment/entities/comment.entity';
import { Activity } from './activity/entities/activity.entity';
import { Attachment } from './attachment/entities/attachment.entity';
import { Notification } from './notification/entities/notification.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SearchModule } from './search/search.module';
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
  SearchModule
],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }, MailService, JwtProviderService],
  exports: [MailService,JwtProviderService]
})
export class AppModule {}
