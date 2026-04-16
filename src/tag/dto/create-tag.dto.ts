import { ApiProperty } from '@nestjs/swagger';
import {
    IsHexColor,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class CreateTagDto {
    @IsString()
    @Length(3, 30)
    @IsNotEmpty()
    @ApiProperty({ example: 'Urgent', description: 'Tag name' })
    name: string;

    @IsHexColor()
    @IsNotEmpty()
    @ApiProperty({ example: '#FF0000', description: 'Tag color in hex format' })
    color: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Priority',
        description: 'Group name for organizing tags (optional)',
        required: false,
    })
    groupName?: string;

    // @IsUUID()
    // @IsNotEmpty()
    // @ApiProperty({
    //     example: 'uuid-here',
    //     description: 'Workspace ID from URL parameter',
    // })
    // workspaceId: string;
}
