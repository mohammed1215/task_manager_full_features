import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { TaskWatcherService } from './task-watcher.service';
import { CreateTaskWatcherDto } from './dto/create-task-watcher.dto';
import { UpdateTaskWatcherDto } from './dto/update-task-watcher.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('task-watcher')
export class TaskWatcherController {
    constructor(private readonly taskWatcherService: TaskWatcherService) {}

    // @Post()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // create(@Body() createTaskWatcherDto: CreateTaskWatcherDto): string {
    //     return this.taskWatcherService.create(createTaskWatcherDto);
    // }

    // @Get()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // findAll(): string {
    //     return this.taskWatcherService.findAll();
    // }

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
