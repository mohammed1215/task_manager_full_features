import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SentMessageInfo } from 'nodemailer';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';

@Injectable()
export class MailService {
    constructor(private  readonly mailService:MailerService,private readonly config:ConfigService,private readonly jwtService:JwtService){}
    async sendForgotPasswordMail(email:string,userId:string){
        //generate token
        const resetToken = await this.jwtService.signAsync({email,userId},{expiresIn:'1h',secret:this.config.get('RESET_SECRET_PASS')})
        //send mail
        return this.mailService.sendMail({
            from:`Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject:"Reset Password",
            html: `<div>Reset Password
             <a href="${this.config.get('BACKEND_URL')}/auth/reset-password?token=${resetToken}&id=${userId}">click here</a>
             if button didn't work
             <a href="${this.config.get('BACKEND_URL')}/auth/reset-password?token=${resetToken}&id=${userId}">
             ${this.config.get('BACKEND_URL')}/auth/reset-password?token=${resetToken}&id=${userId}
             </a>
            </div>`
        }).then(success=>{
            console.log(success)
            return success
        }).catch(err=>{
            throw new BadRequestException(err.message)
        })
    }

    async sendVerificationMail(email:string,verifyToken:string,userId:string){
        const result = await this.mailService.sendMail({
           from:`Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject:"Verify Email",
            html: `<div>Please Verify Your Email
             <a href="${this.config.get('BACKEND_URL')}/auth/verify-email?token=${verifyToken}&id=${userId}">click here</a>
             if button didn't work
             <a href="${this.config.get('BACKEND_URL')}/auth/verify-email?token=${verifyToken}&id=${userId}">
             ${this.config.get('BACKEND_URL')}/auth/verify-email?token=${verifyToken}&id=${userId}
             </a>
            </div>`
        })

        if(result.rejected.length >0) throw new BadRequestException(`couldn't send verification email please try again`)
        return result
    }

    async sendConfirmEmailPasswordReset(email:string){

        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Changed Password`,
            html: `
            <div>
            your password has been changed successfully
            if you didn't change your password please change your password again
            </div>
            `
        })
        if(result.rejected.length >0) throw new BadRequestException(`couldn't send confirm password reset email please try again`)
            return result
    }

    async sendInvitationEmail(email:string,workspaceName:string,invitationId:string,senderId:string){
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Invitation-workspace`,
            html: `
            <div>
            you are invited to workspace ${workspaceName}
            <a href="${this.config.get('BACKEND_URL')}/workspaces/accept-invitation?invitationId=${invitationId}&senderId=${senderId}" style="background-color: green;">Accept</a>
            <a href="${this.config.get('BACKEND_URL')}/workspaces/decline-invitation?invitationId="${invitationId}&senderId=${senderId}" style="background-color: red;">Decline</a>
            </div>
            `
        })
        if(result.rejected.length >0) throw new BadRequestException(`couldn't send invitation email please try again later`)
        return result
    }

    async sendNotifyDeletionEmail(email:string,workspaceName:string){
        const result = await this.mailService.sendMail({
           from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Deletion Workspace`,
            html: `
            <div>
            ${workspaceName} has been deleted
            </div>
            `
        })
        if(result.rejected.length >0) throw new BadRequestException(`couldn't send invitation email please try again later`)
        return result
    }
        
    async sendAssigneeEmailNotification(emails:string[]){
        const result = await this.mailService.sendMail({
           from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            bcc: emails,
            subject: `Task Assignment`,
            html: `
            <div>
            You got assigned to new task
            </div>
            `
        })
        if(result.rejected.length >0) console.log(`couldn't send assignee email to users please try again later`)
        return result
    }

    async sendTaskAssignedEmail(email:string){
        const result = await this.mailService.sendMail({
           from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Assignment`,
            html: `
            <div>
            You got assigned to new task
            </div>
            `
        })
        if(result.rejected.length >0) console.log(`couldn't send assignee email to users please try again later`)
        return result
    }

    async sendUnassignEmailNotification(email:string){
        const result = await this.mailService.sendMail({
           from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Unassignment`,
            html: `
            <div>
            user got unassigned from task
            </div>
            `
        })
        if(result.rejected.length >0) console.log(`couldn't send unassign email notification to user please try again later`)
        return result
    }

    async sendDueTaskNotification(email:string){
        const result = await this.mailService.sendMail({
           from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Due Soon`,
            html: `
            <div>
                due task tomorrow
            </div>
            `
        })
        if(result.rejected.length >0) console.log(`couldn't send unassign email notification to user please try again later`)
        return result
    }

    async sendOverDueTaskNotification(email:string){
        const result = await this.mailService.sendMail({
           from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task Due Soon`,
            html: `
            <div>
                due task tomorrow
            </div>
            `
        })
        if(result.rejected.length >0) console.log(`couldn't send unassign email notification to user please try again later`)
        return result
    }

    async sendWatchEmail(email:string){
        const result = await this.mailService.sendMail({
            from: `Task_Manager<${this.config.get('MAIL_USER')}>`,
            to: email,
            subject: `Task watch comment`,
            html: `
            <div>
                comment has been added
            </div>
            `
        })
    }
}
