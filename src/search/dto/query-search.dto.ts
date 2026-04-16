import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    Min,
    MinLength,
} from 'class-validator';
import { SearchTypes } from '../../enum/enum';

export class SearchQueryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {
        message: 'Search query must be at least 3 characters long',
    })
    @ApiProperty({
        name: 'query',
        required: true,
        example: 'task hello',
        description: 'term to search with',
    })
    q: string;

    @IsUUID()
    @IsOptional()
    @ApiProperty({
        name: 'workspaceId',
        required: false,
        example: '12323-123142-1231232-124324123',
        description: 'id of the workspace that user wants to search for',
    })
    workspaceId?: string;

    @IsEnum(SearchTypes)
    @IsOptional()
    @ApiProperty({
        required: false,
        example: SearchTypes.BOARDS,
        enum: SearchTypes,
        description: 'type of search',
    })
    type?: SearchTypes = SearchTypes.ALL;

    @IsOptional()
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @ApiProperty({
        required: false,
        example: 1,
        minimum: 1,
        default: 1,
        description: 'page number of the search results',
    })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    @Min(1)
    @ApiProperty({
        required: false,
        example: 20,
        minimum: 1,
        default: 20,
        description: 'can not be negative',
    })
    limit?: number = 20;
}
