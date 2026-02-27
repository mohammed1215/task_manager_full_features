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

@Controller('boards')
export class ColumnController {
  constructor(
    private readonly columnService: ColumnService,
    private readonly boardService:BoardService,
    private readonly taskService:TaskService
  ) {}

  @Post(':boardId/columns')
  @UseGuards(JwtGuard)
  create(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
    @Body() createColumnDto: CreateColumnDto
  ) {
    return this.columnService.create(user.userId,boardId,createColumnDto);
  }

  // @Get()
  // findAll() {
  //   return this.columnService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.columnService.findOne(+id);
  // }

  @Post(':boardId/tasks')
  @UseGuards(JwtGuard)
  createTasks(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
    @Body() createTaskDto:CreateTaskDto
  ){
    return this.taskService.create(user.userId,boardId,createTaskDto)
  }

  @Post(':boardId/archive')
  @UseGuards(JwtGuard)
  archiveBoard(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
  ){
    return this.boardService.archiveBoard(user.userId,boardId)
  }

  @Post(':boardId/restore')
  @UseGuards(JwtGuard)
  restoreBoard(
    @User() user:jwtPayload,
    @Param('boardId') boardId:string,
  ){
    return this.boardService.restoreBoard(user.userId,boardId)
  }
  @Patch(':boardId')
  @UseGuards(JwtGuard)
  updateBoard(
    @Param('boardId') boardId: string, @Body() updateBoardDto: UpdateBoardDto,
    @User() user:jwtPayload
  ) {
    return this.boardService.update(user.userId,boardId, updateBoardDto);
  }

  @Delete(':boardId')
  @UseGuards(JwtGuard)
  removeBoard(
    @Param('boardId') boardId: string,
    @User() user:jwtPayload,
    @Body('confirmation') confirmation:string
  ) {
    return this.boardService.remove(user.userId,boardId,confirmation);
  }

  @Patch(':boardId/columns/:columnId')
  @UseGuards(JwtGuard)
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
  reOrderColumn(
    @Param('boardId') boardId:string,
    @Body() reOrderColumnDto:ReOrderColumnDto,
    @User() user:jwtPayload
  ){
    return this.columnService.reorder(user.userId,boardId,reOrderColumnDto)
  }

  @Delete(':boardId/columns/:columnId')
  @UseGuards(JwtGuard)
  remove(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @User() user:jwtPayload
  ) {
    return this.columnService.remove(user.userId,boardId,columnId);
  }
}
