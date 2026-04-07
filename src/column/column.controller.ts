import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { ReOrderColumnDto } from './dto/reorder-column.dto';
import { BoardService } from 'src/board/board.service';
import { UpdateBoardDto } from 'src/board/dto/update-board.dto';
import { TaskService } from 'src/task/task.service';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Columns & Boards Management')
@ApiBearerAuth()
@Controller('boards')
export class ColumnController {
  constructor(
    private readonly columnService: ColumnService,
    private readonly boardService:BoardService,
    private readonly taskService:TaskService
  ) {}

  @Post(':boardId/columns')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create new column', description: 'Create a new column in a board' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiResponse({ status: 201, description: 'Column created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateColumnDto })
  create(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
    @Body() createColumnDto: CreateColumnDto
  ) {
    return this.columnService.create(user.userId,boardId,createColumnDto);
  }

@Get(':boardId/columns')
@UseGuards(JwtGuard)
@ApiOperation({ summary: 'Get all columns in board', description: 'Retrieve all columns for a specific board' })
@ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
@ApiResponse({ status: 200, description: 'Columns retrieved successfully' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
 findAll(
    @Param('boardId') boardId:string,
    @User() user:jwtPayload,    
) {
   return this.columnService.findAll(user.userId,boardId);
 }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.columnService.findOne(+id);
  // }

  @Post(':boardId/tasks')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create task in board', description: 'Create a new task directly in a board' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiBody({ type: CreateTaskDto })
  createTasks(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
    @Body() createTaskDto:CreateTaskDto
  ){
    return this.taskService.create(user.userId,boardId,createTaskDto)
  }

  @Post(':boardId/archive')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Archive board', description: 'Archive a board to hide it from active boards' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiResponse({ status: 200, description: 'Board archived successfully' })
  archiveBoard(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
  ){
    return this.boardService.archiveBoard(user.userId,boardId)
  }

  @Post(':boardId/restore')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Restore archived board', description: 'Restore an archived board back to active' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiResponse({ status: 200, description: 'Board restored successfully' })
  restoreBoard(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
  ){
    return this.boardService.restoreBoard(user.userId,boardId)
  }
  @Patch(':boardId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update board', description: 'Update board information' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiResponse({ status: 200, description: 'Board updated successfully' })
  @ApiBody({ type: UpdateBoardDto })
  updateBoard(
    @Param('boardId') boardId: string, @Body() updateBoardDto: UpdateBoardDto,
    @User() user:jwtPayload
  ) {
    return this.boardService.update(user.userId,boardId, updateBoardDto);
  }

  @Delete(':boardId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete board', description: 'Remove a board permanently' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiResponse({ status: 200, description: 'Board deleted successfully' })
  removeBoard(
    @Param('boardId') boardId: string,
    @User() user:jwtPayload,
    @Body('confirmation') confirmation:string
  ) {
    return this.boardService.remove(user.userId,boardId,confirmation);
  }

  @Patch(':boardId/columns/:columnId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update column', description: 'Update column information' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiParam({ name: 'columnId', type: 'string', description: 'Column UUID' })
  @ApiResponse({ status: 200, description: 'Column updated successfully' })
  @ApiBody({ type: UpdateColumnDto })
  update(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId:string,
    @Body() updateColumnDto: UpdateColumnDto,
    @User() user:jwtPayload
    ) {
    return this.columnService.update(boardId,columnId,user.userId, updateColumnDto);
  }

  @Put(':boardId/columns/reorder')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Reorder columns', description: 'Change the order of columns in a board' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiResponse({ status: 200, description: 'Columns reordered successfully' })
  @ApiBody({ type: ReOrderColumnDto })
  reOrderColumn(
    @Param('boardId') boardId:string,
    @Body() reOrderColumnDto:ReOrderColumnDto,
    @User() user:jwtPayload
  ){
    return this.columnService.reorder(user.userId,boardId,reOrderColumnDto)
  }

  @Delete(':boardId/columns/:columnId')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete column', description: 'Remove a column from a board' })
  @ApiParam({ name: 'boardId', type: 'string', description: 'Board UUID' })
  @ApiParam({ name: 'columnId', type: 'string', description: 'Column UUID' })
  @ApiResponse({ status: 200, description: 'Column deleted successfully' })
  remove(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @User() user:jwtPayload
  ) {
    return this.columnService.remove(user.userId,boardId,columnId);
  }
}
