import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { ParsePositivePipe } from 'src/Pipes/parse-positive.pipe';

@Controller('')
@UseGuards(JwtGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('tasks/:taskId/comments')
  create(
    @User() user:jwtPayload,
    @Param('taskId',ParseUUIDPipe) taskId:string,
    @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(user.userId,taskId,createCommentDto);
  }

  @Get('tasks/:taskId/comments')
  findAll(
    @Param('taskId') taskId:string,
    @Query('page',new DefaultValuePipe(1),new ParseIntPipe({optional:true}),new ParsePositivePipe(true)) page:number,  
    @Query('limit',new DefaultValuePipe(20),new ParseIntPipe({optional:true}),new ParsePositivePipe(true)) limit:number,
  ) {
    return this.commentService.findAll(taskId,page,limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch('comments/:commentId')
  update(
    @User() user:jwtPayload,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto
  ) {
    return this.commentService.update(user.userId,commentId, updateCommentDto);
  }

  @Delete('comments/:commentId')
  remove(
    @User(JwtGuard) user:jwtPayload,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.remove(user.userId,commentId);
  }
}
