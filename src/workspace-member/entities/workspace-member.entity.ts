import { User } from '../../user/entities/user.entity';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailPreference, WorkspaceMemberRoles } from '../../enum/enum';

@Entity()
export class WorkspaceMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: WorkspaceMemberRoles,
    })
    role: WorkspaceMemberRoles;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;

    @Column({
        type: 'enum',
        enum: EmailPreference,
        nullable: true,
    })
    emailPreference: EmailPreference | null;

    // relationships
    @ManyToOne(() => Workspace, (workspace) => workspace.members, {
        onDelete: 'CASCADE',
    })
    workspace: Workspace;

    @ManyToOne(() => User, (user) => user.memberships, {
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
    })
    invitedBy: User;
}
