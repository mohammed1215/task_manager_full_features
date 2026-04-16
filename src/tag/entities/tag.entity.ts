import { Workspace } from '../../workspace/entities/workspace.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity()
@Unique('unique_tag_per_workspace', ['workspace', 'name'])
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 30 })
    name: string;

    @Column()
    color: string;

    @Column({ type: 'varchar', nullable: true })
    groupName: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
    workspace: Workspace;

    @ManyToMany(() => Task, (task) => task.tags, { onDelete: 'CASCADE' })
    tasks: Task[];
}
