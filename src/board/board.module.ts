import { forwardRef, Module } from '@nestjs/common';
import { BoardService } from './board.service.ts';
import { BoardController } from './board.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity.ts';
import { WorkspaceMemberModule } from '../workspace-member/workspace-member.module.ts';
import { ColumnModule } from '../column/column.module.ts';
import { BoardMember } from './entities/board-member.entity.ts';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [TypeOrmModule.forFeature([Board,BoardMember]),WorkspaceMemberModule,forwardRef(()=>ColumnModule)],
  exports:[BoardService]
})
export class BoardModule {}
