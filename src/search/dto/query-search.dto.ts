import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Min, MinLength } from "class-validator";

export enum SearchTypes {
    TASKS='TASKS',
    BOARDS='BOARDS',
    ALL='ALL'
}
export class SearchQueryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3,{ message: 'Search query must be at least 3 characters long' })
    q: string;

    @IsUUID()
    @IsOptional()
    workspaceId?: string;

    @IsEnum(SearchTypes)
    @IsOptional()
    type?: SearchTypes = SearchTypes.ALL;
    
    @IsOptional()
    @IsPositive()
    @IsInt()
    @Type(()=>Number)
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(()=>Number)
    @IsPositive()
    @IsInt()
    @Min(1)
    limit?: number = 20;
}
