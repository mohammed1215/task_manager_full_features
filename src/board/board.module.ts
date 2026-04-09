import { forwardRef, Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { WorkspaceMemberModule } from '../workspace-member/workspace-member.module';
import { ColumnModule } from '../column/column.module';
import { BoardMember } from './entities/board-member.entity';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [TypeOrmModule.forFeature([Board,BoardMember]),WorkspaceMemberModule,forwardRef(()=>ColumnModule)],
  exports:[BoardService]
})
export class BoardModule {}
