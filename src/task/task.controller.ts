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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // @Post()
  // create(@Body() createTaskDto: CreateTaskDto) {
  //   return this.taskService.create(createTaskDto);
  // }

  @Get('boards/:boardId/tasks')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get all tasks in a board', description: 'Retrieve paginated list of tasks for a specific board' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiQuery({ name: 'search', type: 'string', required: false, description: 'Search term for task title/description' })
  @ApiQuery({ name: 'status', type: 'string', required: false, description: 'Filter by task status' })
  @ApiQuery({ name: 'priority', type: 'string', required: false, description: 'Filter by priority' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  findAll(
    @User() user:jwtPayload,
    @Param('boardId',new ParseUUIDPipe()) boardId:string,
    @Query() findTasksQueryDto:FindTasksQueryDto
  ) {
    
    return this.taskService.findAll(user.userId,boardId,findTasksQueryDto);
  }

  @Get('tasks/:taskId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get task details', description: 'Retrieve detailed information about a specific task' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('taskId',ParseUUIDPipe) taskId: string,
    @User() user:jwtPayload
  ) {
    return this.taskService.findOne(user.userId,taskId);
  }

  @Patch(':taskId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update task', description: 'Update task information like title, description, priority, etc.' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiBody({ type: UpdateTaskDto })
  update(
    @User() user:jwtPayload,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.taskService.update(user.userId,taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete task', description: 'Remove a task completely' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(
    @User() user:jwtPayload,
    @Param('taskId') taskId: string
  ) {
    return this.taskService.remove(user.userId,taskId);
  }



  // task assignment
  @Post(`tasks/:taskId/assignees`)
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Assign users to task', description: 'Add one or more users as assignees to a task' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 201, description: 'Users assigned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user IDs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: AssignUsersToTaskDto })
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
  @ApiOperation({ summary: 'Unassign user from task', description: 'Remove a user from task assignees' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User unassigned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task or user not found' })
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
  @ApiOperation({ summary: 'Move task to different column', description: 'Move a task from one column to another' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task moved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid column ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: MoveTaskDto })
  moveTask(
    @User() user:jwtPayload,
    @Param('taskId') taskId:string,
    @Body() moveTaskDto:MoveTaskDto
  ){
    return this.taskService.moveTask(user.userId,taskId,moveTaskDto)
  }
}
