import { IsEnum, IsOptional } from 'class-validator';
import { EmailPreference } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

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
