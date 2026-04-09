import { Task } from "../../task/entities/task.entity.ts";
import { User } from "../../user/entities/user.entity.ts";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    content:string;

    @Column({default:false})
    isEdited:boolean
    
    @CreateDateColumn()
    createdAt:Date;
    
    @UpdateDateColumn()
    updatedAt:Date;


    // Relations
    @ManyToOne(()=>Task,{ onDelete: 'CASCADE' })
    task:Task;

    @ManyToOne(()=>User)
    author:User;
}


