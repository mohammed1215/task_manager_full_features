import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NotificationTypes } from "../entities/notification.entity";

export class CreateNotificationDto {
    @IsEnum(NotificationTypes)
    type: NotificationTypes;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    linkUrl: string;
}
