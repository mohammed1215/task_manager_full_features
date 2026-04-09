import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto.ts';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
