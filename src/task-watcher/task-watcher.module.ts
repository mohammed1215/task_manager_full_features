import { Module } from '@nestjs/common';
import { TaskWatcherService } from './task-watcher.service';
import { TaskWatcherController } from './task-watcher.controller';

@Module({
    controllers: [TaskWatcherController],
    providers: [TaskWatcherService],
})
export class TaskWatcherModule {}
