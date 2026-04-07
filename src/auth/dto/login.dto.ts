import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:"test@gmail.com",description:'email of user'})
    email:string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:"123123123",description:'password of user'})
    password:string;
}