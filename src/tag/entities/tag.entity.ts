import { Workspace } from "src/workspace/entities/workspace.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Task } from "src/task/entities/task.entity";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    name:string;
    
    @Column()
    color:string;
    
    @Column()
    groupName:string;
    
    @CreateDateColumn()
    createdAt:Date;

    @ManyToOne(()=>Workspace,{onDelete:'CASCADE'})
    workspace:Workspace

    @ManyToMany(()=>Task,(task)=>task.tags)
    tasks: Task[]
}
