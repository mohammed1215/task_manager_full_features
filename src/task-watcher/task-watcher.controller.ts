import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskWatcherService } from './task-watcher.service.ts';
import { CreateTaskWatcherDto } from './dto/create-task-watcher.dto.ts';
import { UpdateTaskWatcherDto } from './dto/update-task-watcher.dto.ts';

@Controller('task-watcher')
export class TaskWatcherController {
  constructor(private readonly taskWatcherService: TaskWatcherService) {}

  @Post()
  create(@Body() createTaskWatcherDto: CreateTaskWatcherDto) {
    return this.taskWatcherService.create(createTaskWatcherDto);
  }

  @Get()
  findAll() {
    return this.taskWatcherService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskWatcherService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskWatcherDto: UpdateTaskWatcherDto) {
  //   return this.taskWatcherService.update(+id, updateTaskWatcherDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskWatcherService.remove(+id);
  // }
}
