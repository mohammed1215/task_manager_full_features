import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { Activity } from '../activity/entities/activity.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [
        TypeOrmModule.forFeature([User, Activity, WorkspaceMember]),
        forwardRef(() => AuthModule),
        MulterModule.register({
            storage: multer.memoryStorage(),
            fileFilter(req, file, callback) {
                if (file.mimetype.split('/')[0] !== 'image') {
                    console.error('❌ Rejected: Not an image');
                    callback(
                        new BadRequestException('not allowed file type'),
                        false,
                    );
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
