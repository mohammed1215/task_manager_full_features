import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReOrderColumnDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'uuid', description: 'Column UUID to reorder' })
    columnId: string;

    @IsInt()
    @Type(() => Number)
    @ApiProperty({ example: 2, description: 'New position for the column' })
    newPosition: number;
}
