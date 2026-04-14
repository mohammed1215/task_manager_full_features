import { ApiProperty } from '@nestjs/swagger';
import { ActivityTypes } from '../entities/activity.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  actorId: string;

  @IsEnum(ActivityTypes)
  activityType: ActivityTypes;

  @IsString()
  fieldName: string;
  oldValue?: any;
  newValue?: any;
}
