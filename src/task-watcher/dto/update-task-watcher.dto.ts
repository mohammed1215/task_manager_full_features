import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskWatcherDto } from './create-task-watcher.dto';

export class UpdateTaskWatcherDto extends PartialType(CreateTaskWatcherDto) {}
