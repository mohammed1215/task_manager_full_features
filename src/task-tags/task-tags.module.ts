import { Module } from '@nestjs/common';
import { TaskTagsService } from './task-tags.service';
import { TaskTagsController } from './task-tags.controller';

@Module({
    controllers: [TaskTagsController],
    providers: [TaskTagsService],
})
export class TaskTagsModule {}
