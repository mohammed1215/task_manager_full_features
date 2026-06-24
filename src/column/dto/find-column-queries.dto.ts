import { IsEnum, IsOptional } from 'class-validator';
import { SortBy } from '../../enum/enum';
import { ApiProperty } from '@nestjs/swagger';

export class QueryColumnDto {
    @IsOptional()
    @IsEnum(SortBy)
    @ApiProperty({ enum: SortBy, required: false })
    sortBy?: SortBy;
}
