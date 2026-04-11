import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workspace } from './workspace.entity';
import { User } from '../../user/entities/user.entity';
import { WorkspaceMemberRoles } from '../../workspace-member/enum/WorkspaceMember.enum';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', enum: WorkspaceMemberRoles })
  role: WorkspaceMemberRoles;

  @Column({ type: 'varchar', nullable: true })
  message: string;

  @Column('timestamp')
  deadline: Date;

  @ManyToOne(() => User, (sender) => sender.sentInvitations, {
    onDelete: 'CASCADE',
  })
  sender: User;

  @ManyToOne(() => User, (receiver) => receiver.receivedInvitation, {
    onDelete: 'CASCADE',
  })
  invitedUser: User;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}
