import { Exclude } from 'class-transformer';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { Invitation } from 'src/workspace/entities/invitation.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({type:'varchar',unique:true})
    email : string;
    
    @Column()
    @Exclude()
    password:string;

    @Column()
    firstname: string;
    
    @Column()
    lastname:string;
    
    @Column({nullable:true})
    avatarUrl?:string;
    
    @Column({type:'varchar',nullable:true})
    bio?:string;
    
    @Column({type:'boolean',default:false})
    emailVerified:boolean;
    
    @Column({type:'boolean',default:false})
    isActive:boolean
    
    @CreateDateColumn()
    createdAt:Date;
    
    @UpdateDateColumn()
    updatedAt:Date;
    
    @Column({type:'timestamp',nullable:true})
    lastLoginAt?:Date;


    // A user can be a member of many workspaces
    @OneToMany(()=>WorkspaceMember,(workspaceMember)=>workspaceMember.user)
    memberships: WorkspaceMember[];

    // A user can own many workspaces
    @OneToMany(()=>Workspace, (workspace)=> workspace.owner )
    ownedWorkspaces: Workspace[];

    //invitationLink
    @OneToMany(()=>Invitation,(invitation)=>invitation.sender)
    sentInvitations: Invitation[];

    @OneToMany(()=> Invitation,(invitation)=>invitation.invitedUser)
    receivedInvitation:Invitation[];
}
