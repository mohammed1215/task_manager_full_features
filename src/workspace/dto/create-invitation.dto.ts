import {
    IsEmail,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkspaceMemberRoles } from '../../enum/enum';

const AllowedRoles = Object.values(WorkspaceMemberRoles).filter(
    (role) => role !== WorkspaceMemberRoles.owner,
);
export class CreateInvitationDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email of user to invite',
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(AllowedRoles, {
        message: `Role must be one of: ${AllowedRoles.join(', ')}`,
    })
    @ApiProperty({
        example: 'member',
        enum: ['admin', 'member', 'viewer'],
        description: 'Role for invited user',
    })
    role: Exclude<WorkspaceMemberRoles, WorkspaceMemberRoles.owner>;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: 'Join us!',
        required: false,
        description: 'Custom message for invitation',
    })
    message?: string;
}
