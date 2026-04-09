import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Board } from "./board.entity.ts";
import { User } from "../../user/entities/user.entity.ts";

export enum BoardRoles{
    ADMIN='ADMIN',
    VIEWER='VIEWER',
    MEMBER='MEMBER'
}

@Entity()
@Unique(['user','board'])
export class BoardMember{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'enum',enum:BoardRoles,default:BoardRoles.MEMBER})
    role:BoardRoles;

    @CreateDateColumn()
    joinedAt:Date;

    // relations
    @ManyToOne(()=>Board,board=>board.members,{onDelete:'CASCADE'})
    board:Board;

    @ManyToOne(()=>User,board=>board.boardMembership,{onDelete:'CASCADE'})
    user:User;

    @ManyToOne(()=>User,(user)=>user.sentBoardInvitations)
    invitedBy:User;
}