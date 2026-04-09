import { Module } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service.ts';
import { WorkspaceMemberController } from './workspace-member.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity.ts';

@Module({
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService],
  imports: [TypeOrmModule.forFeature([WorkspaceMember])],
  exports: [WorkspaceMemberService]
})
export class WorkspaceMemberModule {}
