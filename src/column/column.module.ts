import { forwardRef, Module } from '@nestjs/common';
import { ColumnService } from './column.service.ts';
import { ColumnController } from './column.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from './entities/column.entity.ts';
import { BoardModule } from '../board/board.module.ts';
import { TaskModule } from '../task/task.module.ts';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [ColumnService],
  imports: [TypeOrmModule.forFeature([ColumnEntity]),forwardRef(()=>BoardModule),forwardRef(()=>TaskModule)]
})
export class ColumnModule {}
