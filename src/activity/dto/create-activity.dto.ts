import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ActivityTypes } from '../../enum/enum';

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
