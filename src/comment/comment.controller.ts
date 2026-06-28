import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../user/decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { ParsePositivePipe } from '../Pipes/parse-positive.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('')
@UseGuards(JwtGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Create comment on task', description: 'Add a new comment to a task' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 201, description: 'Comment created successfully', type: Comment })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiBody({ type: CreateCommentDto })
  create(
    @User() user: jwtPayload,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(user.userId, taskId, createCommentDto);
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Get task comments', description: 'Retrieve paginated list of comments for a task' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiQuery({ name: 'page', type: 'number', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 20, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully', type: Comment, isArray: true })
  findAll(
    @Param('taskId') taskId: string,
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe({ optional: true }), new ParsePositivePipe(true)) page: number,
    @Query('limit', new DefaultValuePipe(20), new ParseIntPipe({ optional: true }), new ParsePositivePipe(true)) limit: number,
  ): Promise<Comment[]> {
    return this.commentService.findAll(taskId, page, limit);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(+id);
  // }

  @Patch('comments/:commentId')
  @ApiOperation({ summary: 'Update comment', description: 'Update an existing comment' })
  @ApiParam({ name: 'commentId', type: 'string', description: 'Comment UUID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiBody({ type: UpdateCommentDto })
  update(
    @User() user: jwtPayload,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<{ message: string; }> {
    return this.commentService.update(user.userId, commentId, updateCommentDto);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete comment', description: 'Remove a comment' })
  @ApiParam({ name: 'commentId', type: 'string', description: 'Comment UUID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  remove(
    @User(JwtGuard) user: jwtPayload,
    @Param('commentId') commentId: string,
  ): Promise<{ message: string; }> {
    return this.commentService.remove(user.userId, commentId);
  }
}
