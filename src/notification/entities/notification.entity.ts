import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum NotificationTypes{

}
@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>User)
    user:User;
    
    @Column('enum',{enum:NotificationTypes})
    type:NotificationTypes;
    
    @Column()
    title:string;
    
    @Column()
    message:string;
    
    @Column()
    linkUrl:string;
    
    @Column({type:'boolean',default:false})
    isRead:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @Column({type:'timestamp',nullable:true})
    readAt:Date;
}
