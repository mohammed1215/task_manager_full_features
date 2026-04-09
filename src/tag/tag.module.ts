import { Module } from '@nestjs/common';
import { TagService } from './tag.service.ts';
import { TagController } from './tag.controller.ts';

@Module({
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
