import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../user/decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';

@Controller('')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}
    @Get('workspaces/:workspaceId/dashboard')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    dashboard(@Param('workspaceId') workspaceId: string) {
        return this.analyticsService.dashboard(workspaceId);
    }

    // @Get('users/:userId/activity')
    // @UseGuards(AuthGuard('jwt'))
    // getActivityReport(
    //     @Param('userId', new ParseUUIDPipe()) userId: string,
    //     @User() user: jwtPayload,
    // ) {
    //     return this.analyticsService.getActivityReport(userId, user.userId);
    // }
}
