import { Task } from "../../task/entities/task.entity.ts";
import { User } from "../../user/entities/user.entity.ts";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['task', 'user'])
export class TaskWatcher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Task, (task) => task.watchers, { onDelete: 'CASCADE' })
    task: Task;

    @ManyToOne(() => User, (user) => user.watchedTasks, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    watchedAt: Date;
}