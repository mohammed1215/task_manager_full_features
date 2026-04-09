import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceMemberController } from './workspace-member.controller.ts';
import { WorkspaceMemberService } from './workspace-member.service.ts';

describe('WorkspaceMemberController', () => {
  let controller: WorkspaceMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceMemberController],
      providers: [WorkspaceMemberService],
    }).compile();

    controller = module.get<WorkspaceMemberController>(WorkspaceMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
