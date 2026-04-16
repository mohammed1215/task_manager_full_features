import { NotificationTypes } from '../../enum/enum';
import { User } from '../../user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @Column({
        type: 'enum',
        enum: NotificationTypes,
        enumName: 'NotificationTypesEnum',
    })
    type: NotificationTypes;
    @Column()
    title: string;

    @Column()
    message: string;

    @Column()
    linkUrl: string;

    @Column({ type: 'boolean', default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    readAt: Date;
}
