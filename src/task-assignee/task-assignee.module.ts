import { Module } from '@nestjs/common';
import { TaskAssigneeService } from './task-assignee.service.ts';
import { TaskAssigneeController } from './task-assignee.controller.ts';

@Module({
  controllers: [TaskAssigneeController],
  providers: [TaskAssigneeService],
})
export class TaskAssigneeModule {}
