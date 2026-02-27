import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskAssignee } from 'src/task-assignee/entities/task-assignee.entity';
import { ColumnEntity } from 'src/column/entities/column.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { BoardModule } from 'src/board/board.module';
import { TaskWatcher } from 'src/task-watcher/entities/task-watcher.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { AppModule } from 'src/app.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService],
  imports:[TypeOrmModule.forFeature([Task,TaskAssignee,ColumnEntity,Tag,TaskWatcher,BoardMember,WorkspaceMember,User]),forwardRef(()=>BoardModule),forwardRef(()=>AppModule)]
})
export class TaskModule {}
