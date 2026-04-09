import { Module } from '@nestjs/common';
import { TaskTagsService } from './task-tags.service.ts';
import { TaskTagsController } from './task-tags.controller.ts';

@Module({
  controllers: [TaskTagsController],
  providers: [TaskTagsService],
})
export class TaskTagsModule {}
