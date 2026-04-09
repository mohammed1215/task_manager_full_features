import { User } from "../../user/entities/user.entity.ts";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum NotificationTypes {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  USER_MENTIONED = 'USER_MENTIONED',
  TASK_DUE_SOON = 'TASK_DUE_SOON', // 24 hours
  TASK_OVERDUE = 'TASK_OVERDUE',
  WORKSPACE_INVITATION = 'WORKSPACE_INVITATION',
  WATCHED_TASK_COMMENT = 'WATCHED_TASK_COMMENT',
  TASK_UNASSIGNED= 'TASK_UNASSIGNED'
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>User)
    user:User;
    
    @Column('enum',{enum:NotificationTypes})
    type:NotificationTypes;
    
    @Column()
    title:string;
    
    @Column()
    message:string;
    
    @Column()
    linkUrl:string;
    
    @Column({type:'boolean',default:false})
    isRead:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @Column({type:'timestamp',nullable:true})
    readAt:Date;
}
