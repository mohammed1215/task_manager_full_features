import { Test, TestingModule } from '@nestjs/testing';
import { TaskAssigneeService } from './task-assignee.service';

describe('TaskAssigneeService', () => {
    let service: TaskAssigneeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TaskAssigneeService],
        }).compile();

        service = module.get<TaskAssigneeService>(TaskAssigneeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
