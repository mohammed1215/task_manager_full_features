import {
    Controller,
    // Get,
    // Post,
    // Body,
    // Patch,
    // Param,
    // Delete,
} from '@nestjs/common';
import { TaskAssigneeService } from './task-assignee.service';
// import { CreateTaskAssigneeDto } from './dto/create-task-assignee.dto';
// import { UpdateTaskAssigneeDto } from './dto/update-task-assignee.dto';
// import { ApiResponse } from '@nestjs/swagger';

@Controller('task-assignee')
export class TaskAssigneeController {
    constructor(private readonly taskAssigneeService: TaskAssigneeService) {}

    // @Post()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // create(@Body() createTaskAssigneeDto: CreateTaskAssigneeDto): string {
    //     return this.taskAssigneeService.create(createTaskAssigneeDto);
    // }

    // @Get()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // findAll(): string {
    //     return this.taskAssigneeService.findAll();
    // }

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
