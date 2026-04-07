import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateColumnDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'To Do', description: 'Column name' })
    name: string;
}
