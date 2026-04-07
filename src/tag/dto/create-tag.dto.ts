import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Urgent', description: 'Tag name' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '#FF0000', description: 'Tag color in hex format' })
    color?: string;
}
