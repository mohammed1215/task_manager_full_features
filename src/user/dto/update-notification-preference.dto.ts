import { IsEnum, IsNotEmpty } from 'class-validator';
import { EmailPreference } from '../../enum/enum';

export class UpdateNotificationPreferenceDto {
    @IsEnum(EmailPreference)
    @IsNotEmpty()
    emailPreference: EmailPreference;
}
