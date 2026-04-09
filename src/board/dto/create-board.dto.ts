import { IsBoolean, IsEnum, IsHexColor, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Visibility } from "../entities/board.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBoardDto {
    @ApiProperty({ example: 'Board 1' })
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ example: 'Board 1 description' })
    description: string;
    
    @IsString()
    @IsNotEmpty()
    @IsHexColor()
    @IsOptional()
    @ApiProperty({ example: '#666', description:'should be hex color' })
    backgroundColor: string;
    
    @IsEnum(Visibility)
    @ApiProperty({example:'PUBLIC',enum:Visibility})
    visibility: Visibility
}

