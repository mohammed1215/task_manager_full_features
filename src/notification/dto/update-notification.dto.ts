import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto.ts';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
