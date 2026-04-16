import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
    constructor(
        private readonly mailService: MailerService,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) {}
    async sendForgotPasswordMail(email: string, userId: string) {
        //generate token
        const resetToken = await this.jwtService.signAsync(
            { email, userId },
            { expiresIn: '1h', secret: this.config.get('RESET_SECRET_PASS') },
        );
        //send mail
        return this.mailService
            .sendMail({
                from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
                to: email,
                subject: 'Reset Password',
                template: '../templates/forgotPassword',
                context: {
                    FRONTEND_URL: this.config.get('FRONTEND_URL'),
                    resetToken,
                    userId,
                },
            })
            .then((success) => {
                console.log(success);
                return success;
            })
            .catch((err) => {
                throw new BadRequestException(err.message);
            });
    }

    async sendVerificationMail(
        email: string,
        verifyToken: string,
        userId: string,
    ) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: 'Verify Email',
            template: '../templates/verificationMail',
            context: {
                backendUrl: this.config.get('FRONTEND_URL'),
                verifyToken,
                userId,
            },
        });

        if (result.rejected.length > 0)
            throw new BadRequestException(
                `couldn't send verification email please try again`,
            );
        return result;
    }

    async sendConfirmEmailPasswordReset(
        email: string,
        username: string,
        appName: string,
    ) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Changed Password`,
            template: '../templates/sendConfirmEmailPasswordReset',
            context: {
                name: username,
                appName,
            },
        });
        if (result.rejected.length > 0)
            throw new BadRequestException(
                `couldn't send confirm password reset email please try again`,
            );
        return result;
    }

    async sendInvitationEmail(
        email: string,
        workspaceName: string,
        invitationId: string,
        senderId: string,
    ) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Invitation-workspace`,
            template: '../templates/invitationEmailTemplate',
            context: {
                workspaceName,
                frontendUrl: this.config.get('FRONTEND_URL'),
                invitationId,
                senderId,
            },
        });
        if (result.rejected.length > 0)
            throw new BadRequestException(
                `couldn't send invitation email please try again later`,
            );
        return result;
    }

    async sendNotifyDeletionEmail(email: string, workspaceName: string) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Workspace Deleted: ${workspaceName}`,
            template: '../templates/notifyDeletion',
            context: {
                workspaceName,
            },
        });
        if (result.rejected.length > 0)
            throw new BadRequestException(
                `couldn't send deletion notification email please try again later`,
            );
        return result;
    }

    async sendAssigneeEmailNotification(emails: string[]) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            bcc: emails,
            subject: `Task Assignment Notification`,
            template: '../templates/taskAssignment',
            context: {},
        });
        if (result.rejected.length > 0)
            console.log(
                `couldn't send assignee email to users please try again later`,
            );
        return result;
    }

    async sendTaskAssignedEmail(email: string) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Assignment Notification`,
            template: '../templates/taskAssignment',
            context: {},
        });
        if (result.rejected.length > 0)
            console.log(
                `couldn't send assignee email to users please try again later`,
            );
        return result;
    }

    async sendUnassignEmailNotification(email: string) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Unassignment Notification`,
            template: '../templates/taskUnassignment',
            context: {},
        });
        if (result.rejected.length > 0)
            console.log(
                `couldn't send unassign email notification to user please try again later`,
            );
        return result;
    }

    async sendDueTaskNotification(email: string) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Due Soon Reminder`,
            template: '../templates/taskDueSoon',
            context: {},
        });
        if (result.rejected.length > 0)
            console.log(
                `couldn't send task due notification email please try again later`,
            );
        return result;
    }

    async sendOverDueTaskNotification(email: string) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Overdue Alert`,
            template: '../templates/taskOverdue',
            context: {},
        });
        if (result.rejected.length > 0)
            console.log(
                `couldn't send overdue task notification email please try again later`,
            );
        return result;
    }

    async sendWatchEmail(email: string) {
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `New Comment on Watched Task`,
            template: '../templates/taskWatchComment',
            context: {},
        });
        if (result.rejected.length > 0)
            console.log(
                `couldn't send watch email notification to user please try again later`,
            );
        return result;
    }
}
