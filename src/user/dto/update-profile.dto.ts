import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProfileDto{
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstname?:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastname?:string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    bio?:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    currentPassword?:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword?:string;
}