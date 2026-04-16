import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmailPreference } from '../../enum/enum';

export class UpdateWorkspaceNotificationPreferencesDto {
    @IsEnum(EmailPreference)
    @IsOptional()
    @ApiProperty({
        example: 'DAILY_DIGEST',
        description: 'Email notification frequency',
        required: false,
    })
    emailPreference?: EmailPreference;
}
