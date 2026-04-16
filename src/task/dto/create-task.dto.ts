import {
    IsArray,
    IsDateString,
    IsEnum,
    IsPositive,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PriorityTask } from '../../enum/enum';
export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 200)
    @ApiProperty({
        example: 'task 1',
        description: 'task title',
        minLength: 3,
        maxLength: 200,
    })
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        example: 'task 1 description',
        description: 'task description',
    })
    description: string;

    @IsUUID('4')
    @ApiProperty({
        required: false,
        example: 'uuid',
        description: 'column id that you will create task in',
    })
    columnId: string;

    @IsOptional()
    @IsEnum(PriorityTask)
    @ApiProperty({
        required: false,
        example: PriorityTask.high,
        default: PriorityTask.medium,
        description: 'priority of task',
    })
    priority: PriorityTask;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        required: false,
        example: new Date(),
        description: 'due date of task',
    })
    dueDate: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        required: false,
        example: 50,
        description: 'estimated Hours of the task to be done',
    })
    estimatedHours: number;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    @ApiProperty({
        required: false,
        example: ['uuid'],
        description: 'array of assignee ids to assign users to that task',
    })
    assigneeIds: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    @ApiProperty({
        required: false,
        example: ['uuid'],
        description: 'array of tag ids to give tags to that task',
    })
    tagIds: string[];
}
