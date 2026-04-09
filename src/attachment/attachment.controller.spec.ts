import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentController } from './attachment.controller.ts';
import { AttachmentService } from './attachment.service.ts';

describe('AttachmentController', () => {
  let controller: AttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentController],
      providers: [AttachmentService],
    }).compile();

    controller = module.get<AttachmentController>(AttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
