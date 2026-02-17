import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
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
}
