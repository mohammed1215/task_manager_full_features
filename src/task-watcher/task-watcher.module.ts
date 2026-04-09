import { Module } from '@nestjs/common';
import { TaskWatcherService } from './task-watcher.service.ts';
import { TaskWatcherController } from './task-watcher.controller.ts';

@Module({
  controllers: [TaskWatcherController],
  providers: [TaskWatcherService],
})
export class TaskWatcherModule {}
