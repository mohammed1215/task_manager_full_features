import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service.ts';
import { TaskController } from './task.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity.ts';
import { TaskAssignee } from '../task-assignee/entities/task-assignee.entity.ts';
import { ColumnEntity } from '../column/entities/column.entity.ts';
import { Tag } from '../tag/entities/tag.entity.ts';
import { BoardModule } from '../board/board.module.ts';
import { TaskWatcher } from '../task-watcher/entities/task-watcher.entity.ts';
import { BoardMember } from '../board/entities/board-member.entity.ts';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity.ts';
import { AppModule } from '../app.module.ts';
import { User } from '../user/entities/user.entity.ts';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService],
  imports:[TypeOrmModule.forFeature([Task,TaskAssignee,ColumnEntity,Tag,TaskWatcher,BoardMember,WorkspaceMember,User]),forwardRef(()=>BoardModule),forwardRef(()=>AppModule)]
})
export class TaskModule {}
