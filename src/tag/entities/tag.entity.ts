import { Workspace } from "../../workspace/entities/workspace.entity.ts";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Task } from "../../task/entities/task.entity.ts";

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
