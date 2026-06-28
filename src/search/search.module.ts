import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity';
import { Task } from '../task/entities/task.entity';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';

@Module({
    controllers: [SearchController],
    providers: [SearchService],
    imports: [TypeOrmModule.forFeature([Task, Board, WorkspaceMember])],
})
export class SearchModule {}
