import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, example: 'John', description: 'First name' })
  firstname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false, example: 'Doe', description: 'Last name' })
  lastname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    example: 'Software developer',
    description: 'User bio',
  })
  bio?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    example: 'currentpass123',
    description: 'Current password (required if changing password)',
  })
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    required: false,
    example: 'newpass123',
    minimum: 8,
    description: 'New password',
  })
  newPassword?: string;
}
