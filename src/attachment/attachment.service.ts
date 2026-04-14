import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { BoardMember } from '../board/entities/board-member.entity';
import { createReadStream, existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { WorkspaceMemberRoles } from '../workspace-member/enum/WorkspaceMember.enum';
import fs from 'fs';
import { unlink } from 'fs/promises';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityTypes } from '../activity/entities/activity.entity';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepo: Repository<BoardMember>,
    @InjectRepository(WorkspaceMember)
    private readonly workspaceRepo: Repository<WorkspaceMember>,
    private readonly config: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly activityService: ActivityService,
  ) {}
  async create(
    userId: string,
    taskId: string,
    attachment: Express.Multer.File,
    createAttachmentDto: CreateAttachmentDto,
  ) {
    // check if task exists
    const task = await this.taskRepo.findOne({
      where: {
        id: taskId,
      },
      relations: ['attachments', 'board'],
    });
    if (!task) throw new NotFoundException('task not found');

    // check user
    // member in board
    const boardMember = await this.boardMemberRepo.findOne({
      where: {
        board: { id: task.board.id },
      },
    });
    if (!boardMember) throw new NotFoundException('board member not found');

    //check if number of task attachments are 10 or not
    if (task.attachments.length >= 10) {
      throw new BadRequestException(
        'max number of attachments per task reached(10/10)',
      );
    }

    //upload file on cloudinary if production
    let resultOfUploading;
    try {
      if (this.cloudinaryService.isCloudinaryEnabled()) {
        const resourceType = this.getResourceType(attachment.mimetype);

        resultOfUploading = await this.cloudinaryService.uploadFile(
          attachment,
          resourceType,
        );
        // Delete local file after upload (important for Vercel)
        await this.deleteLocalFile(attachment.path);
      } else {
        resultOfUploading = null;
      }

      //create attachment
      const attachmentRow = this.attachmentRepo.create({
        filename: attachment.filename,
        fileSize: attachment.size,
        originalFilename: attachment.originalname,
        uploadedBy: { id: userId },
        task: { id: taskId },
        storagePath: this.cloudinaryService.isCloudinaryEnabled()
          ? resultOfUploading.url
          : `/${attachment.path}`,
        contentType: attachment.mimetype,
      });

      const createdAttachment = await this.attachmentRepo.save(attachmentRow);
      await this.activityService.create({
        activityType: ActivityTypes.attachmentAdded,
        fieldName: 'attachment',
        oldValue: null,
        newValue: {
          attachmentName: createdAttachment.filename,
          size: createdAttachment.fileSize,
        },

        taskId: taskId,
        actorId: userId,
      });
      return createdAttachment;
    } catch (error) {
      if (existsSync(attachment.path)) {
        await this.deleteLocalFile(attachment.path);
      }
      throw error;
    }
  }

  async findAll(taskId: string) {
    //TODO: EDIT URL OF DOWNLOADING
    return {
      attachments: await this.attachmentRepo.find({
        where: {
          task: { id: taskId },
        },
        relations: ['uploadedBy'],
        order: {
          uploadedBy: 'DESC',
        },
      }),
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} attachment`;
  // }

  async download(attachmentId: string) {
    const attachment = await this.attachmentRepo.findOne({
      where: { id: attachmentId },
    });
    if (!attachment) throw new NotFoundException('attachment not found');
    //create read stream
    const file = createReadStream(
      `./upload/attachments/${attachment.filename}`,
    );
    if (this.cloudinaryService.isCloudinaryEnabled()) {
      return {
        url: attachment.storagePath.replace(
          '/upload/',
          '/upload/fl_attachment/',
        ),
        redirect: true,
      };
    }
    return new StreamableFile(file, {
      length: attachment.fileSize,
      type: attachment.contentType,
    });
  }

  update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    return `This action updates a #${id} attachment`;
  }

  async remove(attachmentId: string, userId: string) {
    //check if attachment exists or not
    const attachment = await this.attachmentRepo.findOne({
      where: {
        id: attachmentId,
      },
      relations: ['uploadedBy', 'task', 'task.board', 'task.board.workspace'],
    });
    if (!attachment) throw new NotFoundException('attachment not found');

    //check if user is admin of the workspace or the user is the uploader
    const workspaceMember = await this.workspaceRepo.findOne({
      where: {
        user: { id: userId },
        workspace: { id: attachment.task.board.workspace.id },
      },
    });

    if (!workspaceMember)
      throw new NotFoundException('member not in the workspace');

    if (
      workspaceMember.role !== WorkspaceMemberRoles.admin &&
      workspaceMember.role !== WorkspaceMemberRoles.owner &&
      attachment.uploadedBy.id !== userId
    ) {
      throw new ForbiddenException('Not Allowed Privilages');
    }

    if (fs.existsSync(attachment.storagePath)) {
      fs.unlinkSync(attachment.storagePath);
    }

    await this.attachmentRepo.delete({
      id: attachmentId,
    });
    return { message: 'attachment has been deleted successfully' };
  }

  // Helper method to determine resource type
  private getResourceType(mimetype: string): 'image' | 'video' | 'raw' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    return 'raw'; // PDFs, DOCX, XLSX, etc.
  }

  private async deleteLocalFile(filePath: string): Promise<void> {
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting local file:', error);
    }
  }
}
