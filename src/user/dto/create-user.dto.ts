import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'firstname',
    description: 'firstname of user account',
  })
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'lastname', description: 'lastname of user account' })
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'email@google.com',
    description: 'email of user account',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: 'password',
    minimum: 8,
    description: 'password of user account',
  })
  password: string;
}
