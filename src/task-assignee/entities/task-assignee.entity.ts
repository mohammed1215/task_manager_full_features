import { Task } from '../../task/entities/task.entity';
import { User } from '../../user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
@Unique(['task', 'user'])
export class TaskAssignee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    assignedAt: Date;

    //Relations
    @ManyToOne(() => User, (user) => user.assigningTasks, {
        onDelete: 'CASCADE',
    })
    assignedBy: User;

    @ManyToOne(() => Task, (task) => task.assignedTasks, {
        onDelete: 'CASCADE',
    })
    task: Task;

    @ManyToOne(() => User, (user) => user.assignedTasks, {
        onDelete: 'CASCADE',
    })
    user: User;
}
