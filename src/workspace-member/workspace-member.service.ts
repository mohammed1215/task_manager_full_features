import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository, EntityManager } from 'typeorm';
import { UpdateWorkspaceNotificationPreferencesDto } from './dto/update-workspace-notification-preference.dto';

@Injectable()
export class WorkspaceMemberService {
    constructor(
        @InjectRepository(WorkspaceMember)
        private readonly workspaceMemberRepo: Repository<WorkspaceMember>,
    ) {}
    create(createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
        return 'This action adds a new workspaceMember';
    }

    findAll() {
        return `This action returns all workspaceMember`;
    }

    async findOne(workspaceId: string, memberId: string) {
        const member = await this.workspaceMemberRepo.findOne({
            where: { workspace: { id: workspaceId }, user: { id: memberId } },
        });
        if (!member) throw new NotFoundException('Member Not Found');
        return member;
    }

    async findOneWithManager(
        workspaceId: string,
        memberId: string,
        manager: EntityManager,
    ) {
        const member = await manager.findOne(WorkspaceMember, {
            where: { workspace: { id: workspaceId }, user: { id: memberId } },
        });
        if (!member) throw new NotFoundException('Member Not Found');
        return member;
    }

    update(id: number, updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
        return `This action updates a #${id} workspaceMember`;
    }

    remove(id: number) {
        return `This action removes a #${id} workspaceMember`;
    }

    async getNotificationPreferences(userId: string, workspaceId: string) {
        const member = await this.findOne(workspaceId, userId);
        return {
            emailPreference: member.emailPreference,
        };
    }
    async updateNotificationPreferences(
        userId: string,
        workspaceId: string,
        updateWorkspaceNotificationPreferenceDto: UpdateWorkspaceNotificationPreferencesDto,
    ) {
        const result = await this.workspaceMemberRepo.update(
            {
                user: { id: userId },
                workspace: { id: workspaceId },
            },
            { ...updateWorkspaceNotificationPreferenceDto },
        );

        if (!result.affected) {
            throw new NotFoundException('user not found');
        }

        return { message: `email preference for ${result.raw?.workspace?.id}` };
    }
}
