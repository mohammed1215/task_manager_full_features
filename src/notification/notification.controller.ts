import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({path:'notifications',version:'1'})
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // POST /api/v1/notifications/mark-all-read
  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read', description: 'Mark all user notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@User() user:jwtPayload) {
    await this.notificationService.markAllRead(user.userId);
    return { message: 'All notifications marked as read' }; 
  }

  @Get()
  @ApiOperation({ summary: 'Get user notifications', description: 'Retrieve all notifications for the current user' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  findAll(@User() user:jwtPayload) {
    return this.notificationService.findAllForUser(user.userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notificationService.findOne(+id);
  // }

  // PATCH /api/v1/notifications/{notification_id}/read
  @Patch(':notification_id/read')
  @ApiOperation({ summary: 'Mark notification as read', description: 'Mark a specific notification as read' })
  @ApiParam({ name: 'notification_id', type: 'string', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(@User() user:jwtPayload, @Param('notification_id') notificationId: string) {
    await this.notificationService.markAsRead(user.userId, notificationId);
    return { message: 'Notification marked as read' };
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationService.remove(+id);
  // }
}
