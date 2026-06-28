import { Module } from '@nestjs/common';
import { TaskAssigneeService } from './task-assignee.service';
import { TaskAssigneeController } from './task-assignee.controller';

@Module({
    controllers: [TaskAssigneeController],
    providers: [TaskAssigneeService],
})
export class TaskAssigneeModule {}
