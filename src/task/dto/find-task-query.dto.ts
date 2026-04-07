import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsUUID } from "class-validator";
import { PriorityTask } from "../entities/task.entity";
import { SortBy, SortOrder } from "src/enum/enum";
import { ApiProperty } from "@nestjs/swagger";

export class FindTasksQueryDto{
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 50, description: 'Number of items per page' })
  limit: number = 50;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: 'Page number' })
  page: number = 1;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false, description: 'Filter by column ID' })
  columnId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false, description: 'Filter by assignee user ID' })
  assigneeId?: string;

  @IsOptional()
  @IsEnum(PriorityTask)
  @ApiProperty({ required: false, enum: PriorityTask, description: 'Filter by priority' })
  priority?: PriorityTask;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false, description: 'Filter by tag ID' })
  tagId?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false, example: new Date(), description: 'Filter tasks with due date from this date' })
  dueDateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ required: false, example: new Date(), description: 'Filter tasks with due date to this date' })
  dueDateTo?: Date;

  @IsOptional()
  @ApiProperty({ required: false, example: 'search term', description: 'Search in task title and description' })
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  @ApiProperty({ required: false, enum: SortBy, description: 'Sort by field' })
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiProperty({ required: false, enum: SortOrder, description: 'Sort order (asc/desc)' })
  sortOrder?: SortOrder;
}