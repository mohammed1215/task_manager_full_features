import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsUUID } from "class-validator";
import { PriorityTask } from "../entities/task.entity";
import { SortBy, SortOrder } from "src/enum/enum";

export class FindTasksQueryDto{
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit: number = 50;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @IsUUID()
  columnId?: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsEnum(PriorityTask)
  priority?: PriorityTask;

  @IsOptional()
  @IsUUID()
  tagId?: string;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDateTo?: Date;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}