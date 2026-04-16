import { Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailService } from '../mail/mail.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from '../task/task.service';
import { EmailPreference, NotificationTypes } from '../enum/enum';

@Injectable()
export class NotificationListener {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        private readonly taskService: TaskService,
    ) {}

    @OnEvent('notification.task_assigned')
    async handleTaskAssigned(payload: any) {
        // create notification
        await this.notificationService.create(payload.userId, {
            type: NotificationTypes.TASK_ASSIGNED,
            title: 'New Task Assigned',
            message: `You have been assigned to: ${payload.taskTitle}`,
            linkUrl: `/tasks/${payload.taskId}`,
        });

        // see user preferences
        // const user = await this.userService.findOne(payload.userId)
        if (payload.emailPreference === EmailPreference.IMMEDIATE) {
            this.mailService.sendTaskAssignedEmail(payload.email);
        }

        //TODO: // If 'daily_digest' -> save to a digest queue table
    }

    @OnEvent('notification.task_unassigned')
    async handleTaskUnassigned(payload: any) {
        await this.notificationService.create(payload.userId, {
            type: NotificationTypes.TASK_UNASSIGNED,
            linkUrl: `/tasks/${payload.taskId}`,
            message: `${payload.username} has been unassigned from task: ${payload.taskTitle}`,
            title: 'Task Unassigned',
        });

        // check preferences of user
        if (payload.emailPreference === EmailPreference.IMMEDIATE) {
            this.mailService.sendUnassignEmailNotification(payload.email);
        }
    }

    @OnEvent('notification.mentioned_comment')
    async handleMentionedComment(payload: any) {
        // create notification
        await this.notificationService.create(payload.userId, {
            type: NotificationTypes.USER_MENTIONED,
            title: 'Mentioned',
            message: 'Someone mentioned you in the comments of a task',
            linkUrl: `/mentions/${payload.taskId}`,
        });

        // check preferences of user
        if (payload.emailPreference === EmailPreference.IMMEDIATE) {
            this.mailService.sendUnassignEmailNotification(payload.email);
        }
    }

    @OnEvent('notification.task_due')
    async handleTaskDue(payload: any) {
        await this.notificationService.create(payload.userId, {
            type: NotificationTypes.TASK_DUE_SOON,
            title: 'Task Due 24h',
            message: 'task due date is soon',
            linkUrl: `tasks/${payload.taskId}`,
        });

        // check preferences of user
        if (payload.emailPreference === EmailPreference.IMMEDIATE) {
            this.mailService.sendUnassignEmailNotification(payload.email);
        }
    }
    // @OnEvent('notification.task')
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async autoSendNotificationForDueTasks() {
        const taskAssignees = await this.taskService.findAllWithoutConditions();

        for (const assignee of taskAssignees) {
            await this.notificationService.create(assignee.user.id, {
                type: NotificationTypes.TASK_DUE_SOON,
                title: 'Task Due Tomorrow',
                linkUrl: `/tasks/${assignee.task.id}`,
                message: `task ${assignee.task.title} due is tomorrow`,
            });

            // email preferences
            if (assignee.user.emailPreference === EmailPreference.IMMEDIATE) {
                await this.mailService.sendDueTaskNotification(
                    assignee.user.email,
                );
            }
        }
    }

    @OnEvent('notification.send-invitation')
    async handleInvitationNotification(payload: any) {
        await this.notificationService.create(payload.userId, {
            type: NotificationTypes.WORKSPACE_INVITATION,
            title: 'Workspace Invitation',
            message: 'you have been invited to workspace',
            linkUrl: `/workspaces/${payload.workspaceId}`,
        });

        // email preferences
        if (payload.emailPreference === EmailPreference.IMMEDIATE) {
            await this.mailService.sendInvitationEmail(
                payload.email,
                payload.workspaceName,
                payload.invitationId,
                payload.senderId,
            );
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async autoSendNotificationForOverDueTasks() {
        const taskAssignees = await this.taskService.findOverdueTasks();

        for (const assignee of taskAssignees) {
            await this.notificationService.create(assignee.user.id, {
                type: NotificationTypes.TASK_OVERDUE,
                title: 'Task Overdue',
                linkUrl: `/tasks/${assignee.task.id}`,
                message: `task ${assignee.task.title} is overdue!`,
            });

            // email preferences
            if (assignee.user.emailPreference === EmailPreference.IMMEDIATE) {
                await this.mailService.sendOverDueTaskNotification(
                    assignee.user.email,
                );
            }
        }
    }

    @OnEvent('notification.watched_task_comment')
    async handleCommentNotificationWatcher(payload: any) {
        await this.notificationService.create(payload.userId, {
            type: NotificationTypes.WATCHED_TASK_COMMENT,
            title: 'Comment added to task',
            linkUrl: `/tasks/${payload.taskId}`,
            message: `Someone commented on a task you are watching: ${payload.taskTitle}`,
        });

        // email preferences
        if (payload.emailPreference === EmailPreference.IMMEDIATE) {
            await this.mailService.sendWatchEmail(payload.email);
        }
    }
}
