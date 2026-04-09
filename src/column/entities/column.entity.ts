import { Board } from "../../board/entities/board.entity.ts";
import { Task } from "../../task/entities/task.entity.ts";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ColumnEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;
    
    @Column('int')
    position: number;

    @CreateDateColumn()
    createdAt:Date;

    //Relations
    @ManyToOne(()=>Board,(board)=>board.columns,{onDelete:'CASCADE'})
    board:Board;

    @OneToMany(()=>Task,(task)=>task.column)
    tasksInsideColumn:Task[];
}