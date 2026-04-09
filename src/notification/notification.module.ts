import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { TaskService } from '../task/task.service';
import { TaskModule } from '../task/task.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  imports:[TypeOrmModule.forFeature([Notification]),TaskModule]
})
export class NotificationModule {}
