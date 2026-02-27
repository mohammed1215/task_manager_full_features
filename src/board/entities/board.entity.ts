import { ColumnEntity } from "src/column/entities/column.entity";
import { User } from "src/user/entities/user.entity";
import { Workspace } from "src/workspace/entities/workspace.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BoardMember } from "./board-member.entity";
import { Task } from "src/task/entities/task.entity";

export enum Visibility{
    PUBLIC='PUBLIC',
    PRIVATE='PRIVATE',
    WORKSPACE='WORKSPACE'
}

@Entity()
export class Board {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    name:string;
    
    @Column({type:'varchar',nullable:true})
    description:string;

    @Column({type:'varchar',nullable:true})
    backgroundColor:string;
    
    @Column({default:false})
    isArchived:boolean;
   
    @CreateDateColumn()
    createdAt:Date;
    
    @UpdateDateColumn()
    updatedAt:Date;
    
    @Column('timestamp',{nullable:true})
    archivedAt:Date|null;

    @Column({type:'varchar',default:Visibility.PRIVATE,enum:Visibility})
    visibility:Visibility 

    @DeleteDateColumn()
    deletedAt:Date;

    // Relations
    @ManyToOne(()=>User,{onDelete:'CASCADE'})
    createdBy:User;
    
    @ManyToOne(()=>Workspace,{onDelete:'CASCADE'})
    workspace:Workspace;

    @OneToMany(()=>ColumnEntity,(column)=>column.board)
    columns:ColumnEntity[]

    @OneToMany(()=>BoardMember,(boardMember)=>boardMember.board)
    members: BoardMember[]

    @OneToMany(()=>Task,(task)=>task.board)
    tasksOfBoard:Task[]
}
