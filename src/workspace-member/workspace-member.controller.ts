import {
    Controller,
    Get,
    // Post,
    Body,
    Patch,
    Param,
    // Delete,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
// import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
// import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { UpdateWorkspaceNotificationPreferencesDto } from './dto/update-workspace-notification-preference.dto';
import { User } from '../user/decorator/user.decorator';
import { EmailPreference } from '../enum/enum';
import { ApiResponse } from '@nestjs/swagger';

@Controller('workspace-member')
export class WorkspaceMemberController {
    constructor(
        private readonly workspaceMemberService: WorkspaceMemberService,
    ) {}

    // @Post()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // create(@Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto): string {
    //     return this.workspaceMemberService.create(createWorkspaceMemberDto);
    // }

    // @Get()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // findAll(): string {
    //     return this.workspaceMemberService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.workspaceMemberService.findOne(+id);
    // }

    // @Patch(':id')
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // update(
    //     @Param('id') id: string,
    //     @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    // ): string {
    //     return this.workspaceMemberService.update(
    //         +id,
    //         updateWorkspaceMemberDto,
    //     );
    // }

    // @Delete(':id')
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // remove(@Param('id') id: string): string {
    //     return this.workspaceMemberService.remove(+id);
    // }

    @Patch(':workspaceId/notification-preferences')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Success' })
    updateNotificationPreferences(
        @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
        @Body()
        updateWorkspaceNotificationPreferenceDto: UpdateWorkspaceNotificationPreferencesDto,
        @User() user: jwtPayload,
    ): Promise<{ message: string }> {
        return this.workspaceMemberService.updateNotificationPreferences(
            user.userId,
            workspaceId,
            updateWorkspaceNotificationPreferenceDto,
        );
    }

    @Get(':workspaceId/notification-preferences')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Success' })
    getNotificationPreferences(
        @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
        @User() user: jwtPayload,
    ): Promise<{ emailPreference: EmailPreference | null }> {
        return this.workspaceMemberService.getNotificationPreferences(
            user.userId,
            workspaceId,
        );
    }
}
