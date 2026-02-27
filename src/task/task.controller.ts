import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, DefaultValuePipe, ParseIntPipe, ParseUUIDPipe, ParseEnumPipe, ParseDatePipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { FindTasksQueryDto } from './dto/find-task-query.dto';
import { AssignUsersToTaskDto } from './dto/assign-users.dto';
import { MoveTaskDto } from './entities/move-task.dto';

@Controller('')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // @Post()
  // create(@Body() createTaskDto: CreateTaskDto) {
  //   return this.taskService.create(createTaskDto);
  // }

  @Get('boards/:boardId/tasks')
  @UseGuards(JwtGuard)
  findAll(
    @User() user:jwtPayload,
    @Param('boardId',new ParseUUIDPipe()) boardId:string,
    @Query() findTasksQueryDto:FindTasksQueryDto
  ) {
    
    return this.taskService.findAll(user.userId,boardId,findTasksQueryDto);
  }

  @Get('tasks/:taskId')
  @UseGuards(JwtGuard)
  findOne(
    @Param('taskId',ParseUUIDPipe) taskId: string,
    @User() user:jwtPayload
  ) {
    return this.taskService.findOne(user.userId,taskId);
  }

  @Patch(':taskId')
  @UseGuards(JwtGuard)
  update(
    @User() user:jwtPayload,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.taskService.update(user.userId,taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @UseGuards(JwtGuard)
  remove(
    @User() user:jwtPayload,
    @Param('taskId') taskId: string
  ) {
    return this.taskService.remove(user.userId,taskId);
  }



  // task assignment
  @Post(`tasks/:taskId/assignees`)
  @UseGuards(JwtGuard)
  assignTask(
    @User() user:jwtPayload,
    @Param('taskId') taskId:string,
    @Body() assignUsersToTaskDto: AssignUsersToTaskDto
  ){
    return this.taskService.assignTask(user.userId,taskId,assignUsersToTaskDto)
  }

  // unassignUser
  @Delete(`tasks/:taskId/assignees/:userId`)
  @UseGuards(JwtGuard)
  unassignTask(
    @User() user:jwtPayload,
    @Param('taskId',ParseUUIDPipe) taskId:string,
    @Param('userId',ParseUUIDPipe) userId:string
  ){
    return this.taskService.unassignTask(user.userId,taskId,userId)
  }

  // move task to other column
  @Patch(`tasks/:taskId/move`)
  @UseGuards(JwtGuard)
  moveTask(
    @User() user:jwtPayload,
    @Param('taskId') taskId:string,
    @Body() moveTaskDto:MoveTaskDto
  ){
    return this.taskService.moveTask(user.userId,taskId,moveTaskDto)
  }
}
