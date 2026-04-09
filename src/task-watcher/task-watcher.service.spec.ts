import { Test, TestingModule } from '@nestjs/testing';
import { TaskWatcherService } from './task-watcher.service';

describe('TaskWatcherService', () => {
  let service: TaskWatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskWatcherService],
    }).compile();

    service = module.get<TaskWatcherService>(TaskWatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
