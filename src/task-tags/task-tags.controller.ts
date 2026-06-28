import {
    Controller,
    // Get,
    // Post,
    // Body,
    // Patch,
    // Param,
    // Delete,
} from '@nestjs/common';
import { TaskTagsService } from './task-tags.service';
// import { CreateTaskTagDto } from './dto/create-task-tag.dto';
// import { UpdateTaskTagDto } from './dto/update-task-tag.dto';
// import { ApiResponse } from '@nestjs/swagger';

@Controller('task-tags')
export class TaskTagsController {
    constructor(private readonly taskTagsService: TaskTagsService) {}

    // @Post()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // create(@Body() createTaskTagDto: CreateTaskTagDto): string {
    //     return this.taskTagsService.create(createTaskTagDto);
    // }

    // @Get()
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // findAll(): string {
    //     return this.taskTagsService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.taskTagsService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateTaskTagDto: UpdateTaskTagDto) {
    //   return this.taskTagsService.update(+id, updateTaskTagDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.taskTagsService.remove(+id);
    // }
}
