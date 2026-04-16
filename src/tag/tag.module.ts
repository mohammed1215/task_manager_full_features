import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { AdminWorkspaceGuard } from '../Guards/admin.guard';
import { WorkspaceMemberModule } from '../workspace-member/workspace-member.module';

@Module({
    controllers: [TagController],
    providers: [TagService, AdminWorkspaceGuard],
    imports: [
        TypeOrmModule.forFeature([Tag, WorkspaceMember]),
        WorkspaceMemberModule,
    ],
})
export class TagModule {}
