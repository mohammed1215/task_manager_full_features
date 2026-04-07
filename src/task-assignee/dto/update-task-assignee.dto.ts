import { PartialType } from '@nestjs/swagger';
import { CreateTaskAssigneeDto } from './create-task-assignee.dto';

export class UpdateTaskAssigneeDto extends PartialType(CreateTaskAssigneeDto) {}
