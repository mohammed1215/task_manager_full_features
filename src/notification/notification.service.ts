import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) 
    private readonly notificationRepo: Repository<Notification>,
    
    // Inject Gateway with forwardRef to prevent circular dependency
    @Inject(forwardRef(() => NotificationGateway))
    private readonly gateway: NotificationGateway
  ) {}
  async create(userId:string,createNotificationDto: CreateNotificationDto) {
    //count number of notifications
    const notificationCount = await this.notificationRepo.count({where:{user:{id:userId}}})
    
    if(notificationCount>=100){
    const notification = await this.notificationRepo.findOne({where:{user:{id:userId}},order:{createdAt:'ASC'}})
      if(notification) await this.notificationRepo.delete(notification)
    }
    const notification = this.notificationRepo.create({
      ...createNotificationDto,
      isRead:false,
      user:{id:userId}
    });

    const savedNotification = await this.notificationRepo.save(notification)

    //send count of notification
    const notificationCount2 = await this.notificationRepo.count({where:{user:{id:userId},isRead:false}})
    
    this.gateway.sendToUser(userId,'unread-count',notificationCount2)
    return savedNotification
  }

  async findAllForUser(userId: string) {
    return this.notificationRepo.find({where:{user:{id:userId}},order:{createdAt:'DESC'}});
  }
  
  async countNotifications(userId:string){
    const notificationCount = await this.notificationRepo.count({where:{
      user: {id:userId},
      isRead: false
    }})
    
    return notificationCount
  }
  
  async markAsRead(userId:string,notificationId: string) {
    this.notificationRepo.update({user:{id:userId},id:notificationId,isRead:false},{isRead:true});
    const notificationCount  = await this.countNotifications(userId);
    this.gateway.sendToUser(userId, 'unread_count', notificationCount);
  }

 async markAllRead(userId:string){
    this.notificationRepo.update({user:{id:userId},isRead:false},{isRead:true})
    const notificationCount  = await this.countNotifications(userId);
    this.gateway.sendToUser(userId, 'unread_count', notificationCount);
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
