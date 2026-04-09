import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NotificationTypes } from "../entities/notification.entity.ts";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {
    @IsEnum(NotificationTypes)
    @ApiProperty({example:NotificationTypes.TASK_ASSIGNED,description:"type of notification that will be created",enum:NotificationTypes})
    type: NotificationTypes;   

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'task assigned',description:"title of notification that will be created"})
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'task got assigned to user',description:"type of notification that will be created"})
    message: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'/tasks/taskId',description:"link url to the notification specific thing"})
    linkUrl: string;
}
