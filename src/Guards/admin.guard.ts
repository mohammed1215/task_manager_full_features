import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { Repository } from 'typeorm';
import { WorkspaceMemberRoles } from '../enum/enum';

@Injectable()
export class AdminWorkspaceGuard implements CanActivate {
    constructor(
        @InjectRepository(WorkspaceMember)
        private memberRepo: Repository<WorkspaceMember>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        let workspaceId = request.params['workspaceId'];
        const { userId } = request.user as { userId: string };

        // I WANT THE WORKSPACE ID HMMMMM HOW TO SEND THE WORKSPACE ID TO HERE?

        console.log('Checking if user is admin in workspace:', workspaceId);
        // check if workspaceId exists or not
        if (!workspaceId) {
            throw new BadRequestException('Workspace ID is required');
        }

        //if it was array then get the first workspaceId
        if (Array.isArray(workspaceId)) {
            workspaceId = workspaceId[0];
        }

        //find member in this workspace
        const member = await this.memberRepo.findOne({
            where: {
                workspace: { id: workspaceId },
                user: { id: userId },
            },
        });

        //not exists
        if (!member) {
            throw new ForbiddenException(
                'You are not a member of this workspace',
            );
        }

        //not admin or owner
        if (
            ![WorkspaceMemberRoles.admin, WorkspaceMemberRoles.owner].includes(
                member.role,
            )
        ) {
            throw new ForbiddenException('Only admins can create tags');
        }

        // if passed then return true
        console.log(`User ${userId} is admin in workspace ${workspaceId}`);
        return true;
    }
}
