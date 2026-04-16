import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { UpdateWorkspaceNotificationPreferencesDto } from './dto/update-workspace-notification-preference.dto';
import { User } from '../user/decorator/user.decorator';

@Controller('workspace-member')
export class WorkspaceMemberController {
    constructor(
        private readonly workspaceMemberService: WorkspaceMemberService,
    ) {}

    @Post()
    create(@Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
        return this.workspaceMemberService.create(createWorkspaceMemberDto);
    }

    @Get()
    findAll() {
        return this.workspaceMemberService.findAll();
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.workspaceMemberService.findOne(+id);
    // }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    ) {
        return this.workspaceMemberService.update(
            +id,
            updateWorkspaceMemberDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.workspaceMemberService.remove(+id);
    }

    @Patch(':workspaceId/notification-preferences')
    @UseGuards(AuthGuard('jwt'))
    updateNotificationPreferences(
        @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
        @Body()
        updateWorkspaceNotificationPreferenceDto: UpdateWorkspaceNotificationPreferencesDto,
        @User() user: jwtPayload,
    ) {
        return this.workspaceMemberService.updateNotificationPreferences(
            user.userId,
            workspaceId,
            updateWorkspaceNotificationPreferenceDto,
        );
    }

    @Get(':workspaceId/notification-preferences')
    @UseGuards(AuthGuard('jwt'))
    getNotificationPreferences(
        @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
        @User() user: jwtPayload,
    ) {
        return this.workspaceMemberService.getNotificationPreferences(
            user.userId,
            workspaceId,
        );
    }
}
