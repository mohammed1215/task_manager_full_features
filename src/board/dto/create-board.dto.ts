import { IsBoolean, IsEnum, IsHexColor, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Visibility } from "../entities/board.entity";

export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;
    
    @IsString()
    @IsNotEmpty()
    @IsHexColor()
    @IsOptional()
    backgroundColor: string;
    
    @IsEnum(Visibility)
    visibility: Visibility
}

