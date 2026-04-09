import { PartialType } from '@nestjs/swagger';
import { CreateTaskTagDto } from './create-task-tag.dto.ts';

export class UpdateTaskTagDto extends PartialType(CreateTaskTagDto) {}
