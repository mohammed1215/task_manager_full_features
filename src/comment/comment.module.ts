import { Module } from '@nestjs/common';
import { CommentService } from './comment.service.ts';
import { CommentController } from './comment.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity.ts';
import { Task } from '../task/entities/task.entity.ts';
import { BoardMember } from '../board/entities/board-member.entity.ts';
import { BoardModule } from '../board/board.module.ts';
import { TaskWatcher } from '../task-watcher/entities/task-watcher.entity.ts';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity.ts';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports:[TypeOrmModule.forFeature([Comment,Task,BoardMember,TaskWatcher,WorkspaceMember]),BoardModule]
})
export class CommentModule {}
