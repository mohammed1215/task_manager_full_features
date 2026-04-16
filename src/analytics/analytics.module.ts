import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../task/entities/task.entity';
import { Workspace } from '../workspace/entities/workspace.entity';
import { TaskAssignee } from '../task-assignee/entities/task-assignee.entity';
import { Activity } from '../activity/entities/activity.entity';

@Module({
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    imports: [
        TypeOrmModule.forFeature([Task, Workspace, TaskAssignee, Activity]),
    ],
})
export class AnalyticsModule {}
