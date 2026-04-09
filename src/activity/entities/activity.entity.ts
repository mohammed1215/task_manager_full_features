import { Task } from './task/entities/task.entity';
import { User } from '../../user/entities/user.entity.ts';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ActivityTypes {
  created = 'created',
  updated = 'updated',
  assigned = 'assigned',
  moved = 'moved',
  commented = 'commented',
  attachmentAdded = 'attachmentAdded',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Task, (task) => task.activities)
  task: Task;

  @ManyToOne(() => User)
  actor: User;

  @Column({ type: 'enum', enum: ActivityTypes })
  activityType: ActivityTypes;

  @Column()
  fieldName: string;

  @Column('json')
  oldValue: string;

  @Column('json')
  newValue: string;

  @CreateDateColumn()
  createdAt: Date;
}
