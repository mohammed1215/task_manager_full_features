import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Task } from '../task/entities/task.entity';
import { BoardMember } from '../board/entities/board-member.entity';
import { BoardModule } from '../board/board.module';
import { TaskWatcher } from '../task-watcher/entities/task-watcher.entity';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports:[TypeOrmModule.forFeature([Comment,Task,BoardMember,TaskWatcher,WorkspaceMember]),BoardModule]
})
export class CommentModule {}
