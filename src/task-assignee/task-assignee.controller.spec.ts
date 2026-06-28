import { Test, TestingModule } from '@nestjs/testing';
import { TaskAssigneeController } from './task-assignee.controller';
import { TaskAssigneeService } from './task-assignee.service';

describe('TaskAssigneeController', () => {
    let controller: TaskAssigneeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskAssigneeController],
            providers: [TaskAssigneeService],
        }).compile();

        controller = module.get<TaskAssigneeController>(TaskAssigneeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
