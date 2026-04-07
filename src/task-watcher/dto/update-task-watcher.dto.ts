import { PartialType } from '@nestjs/swagger';
import { CreateTaskWatcherDto } from './create-task-watcher.dto';

export class UpdateTaskWatcherDto extends PartialType(CreateTaskWatcherDto) {}
