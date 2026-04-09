import { User } from "../../user/entities/user.entity.ts";
import { Workspace } from "../../workspace/entities/workspace.entity.ts";
import { Column, Entity,  ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { WorkspaceMemberRoles } from "../enum/WorkspaceMember.enum.ts";

@Entity()
export class WorkspaceMember {
    @PrimaryGeneratedColumn('uuid')
    id :string;
    
    @Column({type:'enum',enum:WorkspaceMemberRoles})
    role:WorkspaceMemberRoles;
    
    @Column({type:'timestamp', default: ()=> "CURRENT_TIMESTAMP"})
    joinedAt:Date;

    // relationships
    @ManyToOne(()=>Workspace,(workspace)=> workspace.members, {
        onDelete: 'CASCADE'
    })
    workspace:Workspace;

    @ManyToOne(()=>User,(user)=>user.memberships, {
        onDelete: 'CASCADE'
    })
    user:User;

    @ManyToOne(()=>User, {
        onDelete: 'CASCADE',
    })
    invitedBy : User
}
