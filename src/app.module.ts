import { ClassSerializerInterceptor, Module } from '@nestjs/common';
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
@Module({
  imports: [UserModule, WorkspaceModule, WorkspaceMemberModule,ConfigModule.forRoot({
    isGlobal:true
  }),
  TypeOrmModule.forRootAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>{
      return {
        type:'postgres',
        url: config.get<string>('DATABASE_CONNECTION_STRING'),
        synchronize:true,
        entities: [User,Workspace,WorkspaceMember]
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
  })
],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }, MailService, JwtProviderService],
  exports: [MailService,JwtProviderService]
})
export class AppModule {}
