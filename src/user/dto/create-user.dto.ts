import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname:string;
    
    @IsString()
    @IsNotEmpty()
    lastname:string;
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password:string;
}
