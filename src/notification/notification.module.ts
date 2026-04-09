import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.ts';
import { NotificationController } from './notification.controller.ts';
import { NotificationGateway } from './notification.gateway.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity.ts';
import { TaskService } from '../task/task.service.ts';
import { TaskModule } from '../task/task.module.ts';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  imports:[TypeOrmModule.forFeature([Notification]),TaskModule]
})
export class NotificationModule {}
