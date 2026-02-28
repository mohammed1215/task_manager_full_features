import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
@UseGuards(JwtGuard)
@Controller({path:'notifications',version:'1'})
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // POST /api/v1/notifications/mark-all-read
  @Post('mark-all-read')
  async markAllAsRead(@User() user:jwtPayload) {
    await this.notificationService.markAllRead(user.userId);
    return { message: 'All notifications marked as read' }; 
  }

  @Get()
  findAll(@User() user:jwtPayload) {
    return this.notificationService.findAllForUser(user.userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationService.findOne(+id);
  // }

  // PATCH /api/v1/notifications/{notification_id}/read
  @Patch(':notification_id/read')
  async markAsRead(@User() user:jwtPayload, @Param('notification_id') notificationId: string) {
    await this.notificationService.markAsRead(user.userId, notificationId);
    return { message: 'Notification marked as read' };
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationService.remove(+id);
  // }
}
