import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from '../workspace/entities/workspace.entity';
import { Repository } from 'typeorm';
import { PriorityTask, Task } from '../task/entities/task.entity';
import { Activity } from '../activity/entities/activity.entity';
import { TaskAssignee } from '../task-assignee/entities/task-assignee.entity';

type dashboardReponse = {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    tasksByPriority: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    };
    tasksByAssignee: { userId; count }[];
    recentActivity: Activity[];
    completionTrend: { date; count }[];
    mostActiveBoards: { boardId; boardName; taskCount }[];
};

type ReportResponse = {
    tasksCreated: number;
    tasksCompleted: number;
    tasksInProgress: number;
    averageCompletionTime: number;
    commentCount: number;
    mostUsedTags: [];
};

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Workspace)
        private workspaceRepo: Repository<Workspace>,
        @InjectRepository(Task)
        private taskRepo: Repository<Task>,
        @InjectRepository(Activity)
        private activityRepo: Repository<Activity>,
        @InjectRepository(TaskAssignee)
        private taskAssigneeRepo: Repository<TaskAssignee>,
    ) {}
    async dashboard(workspaceId: string): Promise<dashboardReponse> {
        const now = new Date();
        //find total number of tasks for the workspace
        //get totalDoneTasks
        //get overdue tasks
        //map tasks by priority
        const stats = (await this.taskRepo
            .createQueryBuilder('task')
            .select([
                'COUNT(*)::INT AS total',
                'COALESCE(COUNT(CASE WHEN task."completedAt" IS NOT NULL THEN 1 END),0)::INT as "completedCount"',
                'COALESCE(COUNT(CASE WHEN task."dueDate" < :now AND task."completedAt" IS NULL THEN 1 END),0)::INT AS "overdueCount"',
                'COUNT(CASE WHEN task.priority = :low THEN 1 END) as low',
                'COUNT(CASE WHEN task.priority = :medium THEN 1 END)as medium',
                'COUNT(CASE WHEN task.priority = :high THEN 1 END)as high',
                'COUNT(CASE WHEN task.priority = :urgent THEN 1 END)as urgent',
            ])
            .innerJoin('task.board', 'board')
            .where('board."workspaceId" = :workspaceId', {
                workspaceId,
                now,
                low: PriorityTask.low,
                medium: PriorityTask.medium,
                high: PriorityTask.high,
                urgent: PriorityTask.urgent,
            })
            .getRawOne()) as {
            total: string;
            completedCount: string;
            overdueCount: string;
            low: string;
            medium: string;
            high: string;
            urgent: string;
        };

        //find recent activities
        const recentActivity = await this.activityRepo.find({
            where: {
                task: { board: { workspace: { id: workspaceId } } },
            },
            relations: ['task', 'task.board', 'task.board.workspace'],
            order: {
                createdAt: 'DESC',
            },
            take: 10,
        });

        //task completionTrend
        const thirtyDays = new Date();
        thirtyDays.setTime(thirtyDays.getTime() - 30 * 24 * 60 * 60 * 1000);

        const completionTrend: { date: Date; count: number }[] =
            await this.taskRepo
                .createQueryBuilder('task')
                .select('task."completedAt"::DATE', 'date')
                .addSelect('COUNT(*)::INT', 'count')
                .innerJoin('task.board', 'board')
                .where('board."workspaceId" = :workspaceId', { workspaceId })
                .andWhere('task."completedAt" > :thirtyDays', { thirtyDays })
                .groupBy('task."completedAt"::DATE') // might ask to be task.completedAt instead of date
                .getRawMany();

        const tasksByAssignee: dashboardReponse['tasksByAssignee'] =
            await this.taskAssigneeRepo
                .createQueryBuilder('task_assignee')
                .select('task_assignee."userId"', 'userId')
                .addSelect('count(*)::INT', 'count')
                .innerJoin('task_assignee.task', 'task')
                .innerJoin('task.board', 'board')
                .where('board."workspaceId" = :workspaceId', { workspaceId })
                .groupBy('task_assignee."userId"')
                .getRawMany();

        const mostActiveBoards: dashboardReponse['mostActiveBoards'] =
            await this.taskRepo
                .createQueryBuilder('task')
                .select('board.id', 'boardId')
                .addSelect('board.name', 'boardName')
                .addSelect('count(*)::INT', 'taskCount')
                .innerJoin('task.board', 'board')
                .where('board."workspaceId" = :workspaceId', { workspaceId })
                .groupBy('board.id')
                .addGroupBy('board.name')
                .orderBy('count(*)', 'DESC')
                .limit(10)
                .getRawMany();

        return {
            totalTasks: parseInt(stats?.total || '0'),
            completedTasks: parseInt(stats?.completedCount || '0'),
            overdueTasks: parseInt(stats?.overdueCount || '0'),
            tasksByPriority: {
                high: parseInt(stats?.high || '0'),
                low: parseInt(stats?.low || '0'),
                medium: parseInt(stats?.medium || '0'),
                urgent: parseInt(stats?.urgent || '0'),
            },
            recentActivity,
            completionTrend,
            tasksByAssignee,
            mostActiveBoards,
        };
    }

    // async getActivityReport(userId: string, loggedInUserId: string):ReportResponse {
    //     if (userId !== loggedInUserId) {
    //         throw new ForbiddenException(
    //             'not allowed getting data of other users',
    //         );
    //     }

    //     //gettings stats
    //     const stats = await this.taskRepo
    //         .createQueryBuilder('task')
    //         .select('COUNT(CASE WHEN task."createdById" = :userId THEN 1 END) as "tasksCreated"')
    //         .select('COUNT(CASE WHEN task."completedAt" IS NOT NULL THEN 1 END) as "tasksCompleted"')
    //         .select('COUNT(CASE WHEN column.title = :inProgress THEN 1 END) as "tasksInProgress"')
    //         .innerJoin('task.column','column')
    //         .getRawOne()

    //     return {
    //         tasksCreated
    //     tasksCompleted
    //     tasksInProgress
    //     averageCompletionTime
    //     commentCount
    //     }
    // }
}
