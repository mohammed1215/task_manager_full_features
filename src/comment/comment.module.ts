import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Task } from 'src/task/entities/task.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { BoardModule } from 'src/board/board.module';
import { TaskWatcher } from 'src/task-watcher/entities/task-watcher.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports:[TypeOrmModule.forFeature([Comment,Task,BoardMember,TaskWatcher,WorkspaceMember]),BoardModule]
})
export class CommentModule {}
