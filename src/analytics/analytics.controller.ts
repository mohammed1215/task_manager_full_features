import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { Activity } from "../activity/entities/activity.entity";

@Controller('')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}
    @Get('workspaces/:workspaceId/dashboard')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Success' })
    dashboard(@Param('workspaceId') workspaceId: string): Promise<{ totalTasks: number; completedTasks: number; overdueTasks: number; tasksByPriority: { low: number; medium: number; high: number; urgent: number; }; tasksByAssignee: { userId: any; count: any; }[]; recentActivity: Activity[]; completionTrend: { date: any; count: any; }[]; mostActiveBoards: { boardId: any; boardName: any; taskCount: any; }[]; }> {
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
