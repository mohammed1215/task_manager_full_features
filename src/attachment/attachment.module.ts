import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Task } from '../task/entities/task.entity';
import { BoardMember } from '../board/entities/board-member.entity';
import { Activity } from '../activity/entities/activity.entity';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ActivityModule } from '../activity/activity.module';
import path from 'path';
@Module({
    controllers: [AttachmentController],
    providers: [AttachmentService],
    imports: [
        MulterModule.register({
            storage: memoryStorage(),
            fileFilter(req, file, callback) {
                const ext = path.extname(file.originalname);
                if (
                    ![
                        '.jpg',
                        '.png',
                        '.gif',
                        '.pdf',
                        '.doc',
                        '.docx',
                        '.xls',
                        '.xlsx',
                        '.txt',
                        '.zip',
                    ].includes(ext)
                ) {
                    console.log(file);
                    callback(
                        new Error(
                            `Allowed Files are ['jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip']`,
                        ),
                        false,
                    );
                    return;
                }

                if (file.size > 10 * 1024 * 1024) {
                    callback(new Error(`max file size 10MB`), false);
                }

                callback(null, true);
            },
        }),
        TypeOrmModule.forFeature([
            Attachment,
            Task,
            BoardMember,
            Activity,
            WorkspaceMember,
        ]),
        CloudinaryModule,
        ActivityModule,
    ],
})
export class AttachmentModule {}
