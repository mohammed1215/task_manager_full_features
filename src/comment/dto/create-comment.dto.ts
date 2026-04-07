import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'This task looks good', description: 'Comment content' })
    content: string;
    
    @IsArray()
    @ApiProperty({ example: ['uuid1', 'uuid2'], required: false, description: 'Array of user IDs mentioned in comment' })
    mentionedUserIds: string[];
}
