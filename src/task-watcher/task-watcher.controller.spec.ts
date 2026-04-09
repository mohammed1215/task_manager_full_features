import { Test, TestingModule } from '@nestjs/testing';
import { TaskWatcherController } from './task-watcher.controller.ts';
import { TaskWatcherService } from './task-watcher.service.ts';

describe('TaskWatcherController', () => {
  let controller: TaskWatcherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskWatcherController],
      providers: [TaskWatcherService],
    }).compile();

    controller = module.get<TaskWatcherController>(TaskWatcherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
