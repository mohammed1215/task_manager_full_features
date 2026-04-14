import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskAssignee } from '../task-assignee/entities/task-assignee.entity';
import { ColumnEntity } from '../column/entities/column.entity';
import { Tag } from '../tag/entities/tag.entity';
import { BoardModule } from '../board/board.module';
import { TaskWatcher } from '../task-watcher/entities/task-watcher.entity';
import { BoardMember } from '../board/entities/board-member.entity';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { AppModule } from '../app.module';
import { User } from '../user/entities/user.entity';
import { ActivityModule } from '../activity/activity.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskAssignee,
      ColumnEntity,
      Tag,
      TaskWatcher,
      BoardMember,
      WorkspaceMember,
      User,
    ]),
    forwardRef(() => BoardModule),
    forwardRef(() => AppModule),
    ActivityModule,

  ],
})
export class TaskModule {}
