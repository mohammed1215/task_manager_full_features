import { IsEnum, IsNotEmpty } from 'class-validator';
import { EmailPreference } from '../entities/user.entity';

export class UpdateNotificationPreferenceDto {
    @IsEnum(EmailPreference)
    @IsNotEmpty()
    emailPreference: EmailPreference;
}
