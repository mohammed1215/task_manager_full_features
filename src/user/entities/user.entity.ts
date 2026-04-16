import { Exclude } from 'class-transformer';
import { Activity } from '../../activity/entities/activity.entity';
import { Attachment } from '../../attachment/entities/attachment.entity';
import { BoardMember } from '../../board/entities/board-member.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { TaskAssignee } from '../../task-assignee/entities/task-assignee.entity';
import { TaskWatcher } from '../../task-watcher/entities/task-watcher.entity';
import { Task } from '../../task/entities/task.entity';
import { WorkspaceMember } from '../../workspace-member/entities/workspace-member.entity';
import { Invitation } from '../../workspace/entities/invitation.entity';
import { Workspace } from '../../workspace/entities/workspace.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

export enum EmailPreference {
    IMMEDIATE = 'immediate',
    DAILY_DIGEST = 'daily_digest',
    DISABLED = 'disabled',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ type: 'varchar', nullable: true })
    bio?: string;

    @Column({ type: 'boolean', default: false })
    emailVerified: boolean;

    @Column({
        type: 'enum',
        enum: EmailPreference,
        default: EmailPreference.IMMEDIATE,
    })
    emailPreference: EmailPreference;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt?: Date;

    @Column('int', { default: 0 })
    failedLoginAttempts: number;

    @Column('timestamp', { nullable: true })
    lockUntil: Date | null;

    // A user can be a member of many workspaces
    @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
    memberships: WorkspaceMember[];

    // A user can own many workspaces
    @OneToMany(() => Workspace, (workspace) => workspace.owner)
    ownedWorkspaces: Workspace[];

    //invitationLink
    @OneToMany(() => Invitation, (invitation) => invitation.sender)
    sentInvitations: Invitation[];

    @OneToMany(() => Invitation, (invitation) => invitation.invitedUser)
    receivedInvitation: Invitation[];

    @OneToMany(() => BoardMember, (boardMember) => boardMember.user)
    boardMembership: BoardMember[];

    @OneToMany(() => BoardMember, (boardMember) => boardMember.invitedBy)
    sentBoardInvitations: BoardMember[];

    @OneToMany(() => Task, (task) => task.createdBy)
    createdTasks: Task[];

    @OneToMany(() => TaskAssignee, (task) => task.user)
    assignedTasks: TaskAssignee[];

    @OneToMany(() => TaskAssignee, (task) => task.assignedBy)
    assigningTasks: TaskAssignee[];

    @OneToMany(() => TaskWatcher, (task) => task.user)
    watchedTasks: TaskWatcher[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Comment[];

    @OneToMany(() => Activity, (activity) => activity.actor)
    activities: Activity[];

    @OneToMany(() => Attachment, (attachment) => attachment.uploadedBy)
    attachments: Attachment[];
}
