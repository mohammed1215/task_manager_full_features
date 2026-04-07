import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, MaxFileSizeValidator, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('')
@UseGuards(JwtGuard)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('tasks/:taskId/attachments')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload task attachment', description: 'Upload a file attachment to a task (max 10MB)' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Attachment uploaded successfully' })
  @ApiResponse({ status: 400, description: 'File too large' })
  create(
    @User() user:jwtPayload,
    @Param('taskId') taskId:string,
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile('file',new ParseFilePipe({fileIsRequired:true,validators:[new MaxFileSizeValidator({maxSize:10 * 1024 * 1024})]})) attachment:Express.Multer.File
  ) {
    return this.attachmentService.create(user.userId,taskId,attachment,createAttachmentDto);
  }

  @Get('tasks/:taskId/attachments')
  @ApiOperation({ summary: 'Get task attachments', description: 'Retrieve all attachments for a task' })
  @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Attachments retrieved successfully' })
  findAll(@Param('taskId') taskId:string) {
    return this.attachmentService.findAll(taskId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.attachmentService.findOne(+id);
  // }

  //get download file
  @Get('attachments/:attachmentId/download')
  @ApiOperation({ summary: 'Download attachment', description: 'Download an attachment file' })
  @ApiParam({ name: 'attachmentId', type: 'string', description: 'Attachment UUID' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  downloadAttachment(
    @Param('attachmentId') attachmentId:string
  ){
    return this.attachmentService.download(attachmentId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttachmentDto: UpdateAttachmentDto) {
    return this.attachmentService.update(+id, updateAttachmentDto);
  }

  @Delete('attachments/{attachmentId}')
  @ApiOperation({ summary: 'Delete attachment', description: 'Remove an attachment file' })
  @ApiParam({ name: 'attachmentId', type: 'string', description: 'Attachment UUID' })
  @ApiResponse({ status: 200, description: 'Attachment deleted successfully' })
  remove(@User() user:jwtPayload,@Param('attachmentId') attachmentId: string) {
    return this.attachmentService.remove(attachmentId,user.userId);
  }
}
