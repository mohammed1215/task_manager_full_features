import { Activity } from "src/activity/entities/activity.entity";
import { Attachment } from "src/attachment/entities/attachment.entity";
// import { Attachment } from "src/attachment/entities/attachment.entity";
import { Board } from "src/board/entities/board.entity";
import { ColumnEntity } from "src/column/entities/column.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { Tag } from "src/tag/entities/tag.entity";
import { TaskAssignee } from "src/task-assignee/entities/task-assignee.entity";
import { TaskWatcher } from "src/task-watcher/entities/task-watcher.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum PriorityTask{
    low='low',
    medium='medium',
    high='high',
    urgent='urgent',
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    taskNumber: string; 

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: PriorityTask, default: PriorityTask.medium })
    priority: PriorityTask;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({ type: 'decimal', nullable: true })
    estimatedHours: number; 

    @Column({ type: 'int' })
    position: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    // Relations
    @ManyToOne(() => Board, (board) => board.tasksOfBoard, { onDelete: 'CASCADE' })
    board: Board;

    @ManyToOne(() => ColumnEntity, (column) => column.tasksInsideColumn, { onDelete: 'CASCADE' })
    column: ColumnEntity;

    @ManyToOne(() => User, (user) => user.createdTasks, { onDelete: 'CASCADE' })
    createdBy: User;

    @OneToMany(()=>TaskAssignee,(task)=>task.task,{
        cascade:true
    })
    assignedTasks: TaskAssignee[]

   @ManyToMany(() => Tag, (tag) => tag.tasks)
    @JoinTable({ name: 'task_tags' }) // TypeORM هيعمل الجدول الوسيط تلقائياً
    tags: Tag[]

    @OneToMany(()=>TaskWatcher,(taskwatcher)=>taskwatcher.task,{
        cascade:true
    })
    watchers:TaskWatcher[]

    @OneToMany(()=>Comment,(comment)=>comment.task)
    comment: Comment[]

    @OneToMany(()=>Activity,(activity)=>activity.task)
    activities:Activity[]

    @OneToMany(()=>Attachment,attachment=>attachment.task)
    attachments:Attachment[]

}
