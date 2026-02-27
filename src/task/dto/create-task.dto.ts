import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { PriorityTask } from "../entities/task.entity";

export class CreateTaskDto {
    
    @IsString()
    @IsNotEmpty()
    @Length(3, 200)
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsUUID('4')
    columnId: string;

    @IsOptional()
    @IsEnum(PriorityTask)
    priority: PriorityTask;

    @IsOptional()
    @IsDateString()
    dueDate: string; 

    @IsOptional()
    @IsNumber()
    estimatedHours: number;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    assigneeIds: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    tagIds: string[];
}