import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    MaxFileSizeValidator,
    ParseFilePipe,
    StreamableFile,
} from '@nestjs/common';

import { AttachmentService } from './attachment.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../user/decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { Attachment } from './entities/attachment.entity';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('')
@UseGuards(JwtGuard)
export class AttachmentController {
    constructor(private readonly attachmentService: AttachmentService) {}

    @Post('tasks/:taskId/attachments')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Upload task attachment',
        description: 'Upload a file attachment to a task (max 10MB)',
    })
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
    @ApiResponse({
        status: 201,
        description: 'Attachment uploaded successfully',
        type: Attachment,
    })
    @ApiResponse({ status: 400, description: 'File too large' })
    create(
        @User() user: jwtPayload,
        @Param('taskId') taskId: string,
        @Body() createAttachmentDto: CreateAttachmentDto,
        @UploadedFile(
            'file',
            new ParseFilePipe({
                fileIsRequired: true,
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
                ],
            }),
        )
        attachment: Express.Multer.File,
    ): Promise<Attachment> {
        return this.attachmentService.create(user.userId, taskId, attachment);
    }

    @Get('tasks/:taskId/attachments')
    @ApiOperation({
        summary: 'Get task attachments',
        description: 'Retrieve all attachments for a task',
    })
    @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
    @ApiResponse({
        status: 200,
        description: 'Attachments retrieved successfully',
    })
    findAll(
        @Param('taskId') taskId: string,
    ): Promise<{ attachments: Attachment[] }> {
        return this.attachmentService.findAll(taskId);
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.attachmentService.findOne(+id);
    // }

    //get download file
    @Get('attachments/:attachmentId/download')
    @ApiOperation({
        summary: 'Download attachment',
        description: 'Download an attachment file',
    })
    @ApiParam({
        name: 'attachmentId',
        type: 'string',
        description: 'Attachment UUID',
    })
    @ApiResponse({ status: 200, description: 'File downloaded successfully' })
    @ApiResponse({ status: 404, description: 'Attachment not found' })
    downloadAttachment(
        @Param('attachmentId') attachmentId: string,
    ): Promise<StreamableFile | { url: string; redirect: boolean }> {
        return this.attachmentService.download(attachmentId);
    }

    // @Patch(':id')
    // @ApiResponse({ status: 200, type: string, description: 'Success' })
    // update(
    //     @Param('id') id: string,
    //     @Body() updateAttachmentDto: UpdateAttachmentDto,
    // ): string {
    //     return this.attachmentService.update(+id, updateAttachmentDto);
    // }

    @Delete('attachments/{attachmentId}')
    @ApiOperation({
        summary: 'Delete attachment',
        description: 'Remove an attachment file',
    })
    @ApiParam({
        name: 'attachmentId',
        type: 'string',
        description: 'Attachment UUID',
    })
    @ApiResponse({
        status: 200,
        description: 'Attachment deleted successfully',
    })
    remove(
        @User() user: jwtPayload,
        @Param('attachmentId') attachmentId: string,
    ): Promise<{ message: string }> {
        return this.attachmentService.remove(attachmentId, user.userId);
    }
}
