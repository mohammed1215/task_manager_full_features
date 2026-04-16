import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
    BadRequestException,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../user/decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { WorkspaceMemberRoles } from '../enum/enum';

@ApiTags('Workspaces')
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @Post()
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Create new workspace',
        description: 'Create a new workspace for the current user',
    })
    @ApiResponse({ status: 201, description: 'Workspace created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: CreateWorkspaceDto })
    async create(
        @User() user: jwtPayload,
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ) {
        const workspace = await this.workspaceService.create(
            user.userId,
            createWorkspaceDto,
        );
        return workspace;
    }

    @Get()
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Get user workspaces',
        description:
            'Retrieve all workspaces for the current user with optional filtering',
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false,
        example: 20,
        description: 'Items per page',
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
        required: false,
        example: 1,
        description: 'Page number',
    })
    @ApiQuery({
        name: 'filter',
        type: 'string',
        required: false,
        enum: ['owned', 'member', 'all'],
        description: 'Filter workspaces',
    })
    @ApiResponse({
        status: 200,
        description: 'Workspaces retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(
        @User() user: jwtPayload,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('filter', new DefaultValuePipe('all'))
        filter: 'owned' | 'member' | 'all',
    ) {
        return this.workspaceService.findAll(user.userId, limit, page, filter);
    }

    @Patch(':workspaceId')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Update workspace',
        description: 'Update workspace information',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
    @ApiResponse({ status: 200, description: 'Workspace updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: UpdateWorkspaceDto })
    update(
        @User() user: jwtPayload,
        @Param('workspaceId') workspaceId: string,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    ) {
        return this.workspaceService.update(
            user.userId,
            workspaceId,
            updateWorkspaceDto,
        );
    }

    @Delete(':workspaceId')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Delete workspace',
        description: 'Remove a workspace permanently',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
    @ApiResponse({ status: 200, description: 'Workspace deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    removeWorkspace(
        @Param('workspaceId') workspaceId: string,
        @User() user: jwtPayload,
        @Body('confirmation') confirmation: string,
    ) {
        return this.workspaceService.removeWorkspace(
            user.userId,
            workspaceId,
            confirmation,
        );
    }

    @Get(':workspaceId/members')
    @ApiOperation({
        summary: 'Get workspace members',
        description: 'Retrieve all members of a workspace',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
    @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Workspace not found' })
    findMembers(@Param('workspaceId') workspaceId: string) {
        return this.workspaceService.findMembersForOneWorkspace(workspaceId);
    }

    @Patch(':workspaceId/members/:userId')
    @ApiOperation({
        summary: 'Update member role',
        description: 'Change member role to admin, member, or viewer',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
    @ApiParam({ name: 'userId', type: 'string', description: 'User UUID' })
    @ApiResponse({
        status: 200,
        description: 'Member role updated successfully',
    })
    @ApiResponse({ status: 400, description: 'Invalid role' })
    @ApiBody({
        schema: {
            properties: {
                role: { type: 'string', enum: ['admin', 'member', 'viewer'] },
            },
        },
    })
    updateMembersPrivilages(
        @Param('workspaceId') workspaceId: string,
        @User() currentUser: jwtPayload,
        @Param('userId') userId: string,
        @Body('role') role: Exclude<WorkspaceMemberRoles, 'owner'>,
    ) {
        const allowedRoles = Object.values(WorkspaceMemberRoles).filter(
            (role) => role !== 'owner',
        );
        if (!allowedRoles.includes(role))
            throw new BadRequestException(
                'allowed roles should be admin|member|viewer',
            );
        return this.workspaceService.updateMembersPrivilages(
            workspaceId,
            currentUser.userId,
            userId,
            role,
        );
    }

    @Delete(':workspaceId/members/:userId')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Remove member from workspace',
        description: 'Remove a member from a workspace',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
    @ApiParam({ name: 'userId', type: 'string', description: 'User UUID' })
    @ApiResponse({ status: 200, description: 'Member removed successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    remove(
        @Param('workspaceId') workspaceId: string,
        @Param('userId') userId: string,
        @User() currentUser: jwtPayload,
    ) {
        return this.workspaceService.remove(
            workspaceId,
            userId,
            currentUser.userId,
        );
    }

    @Post(':workspaceId/invitations')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Invite member to workspace',
        description: 'Send invitation to user to join workspace',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
    @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
    @ApiResponse({ status: 400, description: 'Invalid email' })
    @ApiBody({ type: CreateInvitationDto })
    inviteMember(
        @Param('workspaceId') workspaceId: string,
        @User() user: jwtPayload,
        @Body() createInvitationDto: CreateInvitationDto,
    ) {
        return this.workspaceService.inviteMember(
            workspaceId,
            user.userId,
            createInvitationDto,
        );
    }

    @Post('accept-invitation')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Accept workspace invitation',
        description: 'Accept an invitation to join a workspace',
    })
    @ApiQuery({
        name: 'invitationId',
        type: 'string',
        description: 'Invitation UUID',
    })
    @ApiQuery({
        name: 'senderId',
        type: 'string',
        description: 'Sender user UUID',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation accepted successfully',
    })
    @ApiResponse({ status: 400, description: 'Invalid invitation' })
    async acceptInvitation(
        @Query('invitationId') invitationId: string,
        @Query('senderId') senderId: string,
        @User() user: jwtPayload,
    ) {
        const workspaceMember = await this.workspaceService.acceptInvitation(
            invitationId,
            user.userId,
            senderId,
        );
        return {
            message: 'accepted invitation successfully',
        };
    }
}
