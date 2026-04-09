import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskAssigneeService } from './task-assignee.service.ts';
import { CreateTaskAssigneeDto } from './dto/create-task-assignee.dto.ts';
import { UpdateTaskAssigneeDto } from './dto/update-task-assignee.dto.ts';

@Controller('task-assignee')
export class TaskAssigneeController {
  constructor(private readonly taskAssigneeService: TaskAssigneeService) {}

  @Post()
  create(@Body() createTaskAssigneeDto: CreateTaskAssigneeDto) {
    return this.taskAssigneeService.create(createTaskAssigneeDto);
  }

  @Get()
  findAll() {
    return this.taskAssigneeService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskAssigneeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskAssigneeDto: UpdateTaskAssigneeDto) {
  //   return this.taskAssigneeService.update(+id, updateTaskAssigneeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskAssigneeService.remove(+id);
  // }
}
