import { User } from "src/user/entities/user.entity";
import { WorkspaceMember } from "src/workspace-member/entities/workspace-member.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "src/board/entities/board.entity"

@Entity()
export class Workspace {
    @PrimaryGeneratedColumn('uuid')
    id :string;
    
    @Column('varchar')
    name:string;
    
    @Column('varchar', { unique: true }) 
    slug: string;
    
    @Column({type:'varchar',nullable:true})
    description:string;

    @Column({ type: 'boolean', default: false })
    isPrivate:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    //Relationships
    @ManyToOne(()=>User,user=>user.ownedWorkspaces, {
        onDelete: 'CASCADE'
    })
    owner: User

    @OneToMany(()=>WorkspaceMember,(workspaceMember)=> workspaceMember.workspace)
    members: WorkspaceMember[]

    @OneToMany(()=>Board,(board)=>board.workspace)
    boards:Board[]
}


