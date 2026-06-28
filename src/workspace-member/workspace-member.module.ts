import { Module } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';

@Module({
    controllers: [WorkspaceMemberController],
    providers: [WorkspaceMemberService],
    imports: [TypeOrmModule.forFeature([WorkspaceMember])],
    exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
