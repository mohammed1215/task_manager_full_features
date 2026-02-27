import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, DefaultValuePipe, ParseIntPipe, ParseEnumPipe } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

export enum BoardFilter {
  ALL = 'all',
  ARCHIVED = 'archived',
  ACTIVE = 'active'
}

@Controller('workspaces')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post(':workspaceId/boards')
  @UseGuards(JwtGuard)
  create(
    @Param('workspaceId') workspaceId:string,
    @Body() createBoardDto: CreateBoardDto,
    @User() user:jwtPayload
  ) {
    return this.boardService.create(user.userId,workspaceId,createBoardDto);
  }




  @Get(':workspaceId/boards')
  @UseGuards(JwtGuard)
  findAll(
    @Param('workspaceId') workspaceId:string,
    @User() user:jwtPayload,
    @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
    @Query('limit', new DefaultValuePipe(10),ParseIntPipe) limit:number,
    @Query('filter',new DefaultValuePipe(BoardFilter.ALL), new ParseEnumPipe(BoardFilter)) filter:'all'|'archived'|'active'
  ) {
    return this.boardService.findAll(user.userId,workspaceId,page,limit,filter);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.boardService.findOne(+id);
  // }

}
