import { Test, TestingModule } from '@nestjs/testing';
import { ColumnController } from './column.controller.ts';
import { ColumnService } from './column.service.ts';

describe('ColumnController', () => {
  let controller: ColumnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnController],
      providers: [ColumnService],
    }).compile();

    controller = module.get<ColumnController>(ColumnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
