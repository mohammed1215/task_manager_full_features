import { Task } from "src/task/entities/task.entity";
import { User } from "src/user/entities/user.entity";
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