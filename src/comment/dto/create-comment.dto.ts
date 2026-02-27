import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;
    
    @IsArray()
    mentionedUserIds: string[];
}
