import { Module } from '@nestjs/common';
import { SearchService } from './search.service.ts';
import { SearchController } from './search.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity.ts';
import { Task } from '../task/entities/task.entity.ts';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity.ts';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [TypeOrmModule.forFeature([Task,Board,WorkspaceMember])]
})
export class SearchModule {}
