import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, MaxFileSizeValidator, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('')
@UseGuards(JwtGuard)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('tasks/:taskId/attachments')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @User() user:jwtPayload,
    @Param('taskId') taskId:string,
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile('file',new ParseFilePipe({
      fileIsRequired:true,
      validators: [
        new MaxFileSizeValidator({maxSize:10 * 1024 * 1024}),
      ]
    })) attachment:Express.Multer.File
  ) {
    return this.attachmentService.create(user.userId,taskId,attachment,createAttachmentDto);
  }

  @Get('tasks/:taskId/attachments')
  findAll(@Param('taskId') taskId:string) {
    return this.attachmentService.findAll(taskId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentService.findOne(+id);
  }

  //get download file
  @Get('attachments/:attachmentId/download')
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
  remove(@User() user:jwtPayload,@Param('attachmentId') attachmentId: string) {
    return this.attachmentService.remove(attachmentId,user.userId);
  }
}
