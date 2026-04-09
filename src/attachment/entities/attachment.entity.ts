import { Task } from "../../task/entities/task.entity.ts";
import { User } from "../../user/entities/user.entity.ts";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    filename:string;

    @Column()
    originalFilename:string;
    
    @Column('float')
    fileSize:number;

    @Column()
    contentType:string;

    @Column('text')
    storagePath:string;

    @CreateDateColumn()
    createdAt:Date;

    @ManyToOne(()=>Task,{onDelete:'CASCADE'})
    task:Task;

    @ManyToOne(()=>User)
    uploadedBy:User;
}
