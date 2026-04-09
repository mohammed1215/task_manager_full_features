import { forwardRef, Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from './entities/column.entity';
import { BoardModule } from '../board/board.module';
import { TaskModule } from '../task/task.module';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [ColumnService],
  imports: [TypeOrmModule.forFeature([ColumnEntity]),forwardRef(()=>BoardModule),forwardRef(()=>TaskModule)]
})
export class ColumnModule {}
