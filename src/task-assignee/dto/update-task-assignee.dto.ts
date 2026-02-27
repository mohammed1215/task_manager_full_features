import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskAssigneeDto } from './create-task-assignee.dto';

export class UpdateTaskAssigneeDto extends PartialType(CreateTaskAssigneeDto) {}
