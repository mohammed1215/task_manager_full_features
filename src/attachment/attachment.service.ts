import { BadRequestException, ForbiddenException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { loadEnvFile } from 'process';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { WorkspaceMemberRoles } from 'src/workspace-member/enum/WorkspaceMember.enum';
import fs from 'fs'
loadEnvFile()

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepo:Repository<Attachment>,
    @InjectRepository(Task) private readonly taskRepo:Repository<Task>,
    @InjectRepository(BoardMember) private readonly boardMemberRepo:Repository<BoardMember>,
    @InjectRepository(WorkspaceMember) private readonly workspaceRepo:Repository<WorkspaceMember>,
    private readonly config:ConfigService,
  ){}
  async create(userId:string,taskId:string,attachment:Express.Multer.File,createAttachmentDto: CreateAttachmentDto) {
    // check if task exists
    const task = await this.taskRepo.findOne({where:{
      id: taskId,
    },relations: ['attachments','board']})
    if(!task) throw new NotFoundException('task not found')
    
    // check user
    // member in board
    const boardMember = await this.boardMemberRepo.findOne({where:{
      board: {id:task.board.id}
    }})
    if(!boardMember) throw new NotFoundException('board member not found')

    //check if number of task attachments are 10 or not
    if(task.attachments.length>=10){
      throw new BadRequestException('max number of attachments per task reached(10/10)')
    }

    //create attachment
   const attachmentRow =  this.attachmentRepo.create({
      filename:attachment.filename,
      fileSize: attachment.size,
      originalFilename:attachment.originalname,
      uploadedBy: {id:userId},
      task: {id:taskId},
      storagePath: `/${attachment.path}`,
      contentType: attachment.mimetype
    })
    return this.attachmentRepo.save(attachmentRow);
  }

  async findAll(
    taskId:string,
  ) {
    //TODO: EDIT URL OF DOWNLOADING
    const attachments =  await this.attachmentRepo.find({
      where:{
        task: {id:taskId},
      },
      relations:['uploadedBy'],
      order:{
        uploadedBy:'DESC'
      }
    })
    return {attachments:attachments.map(attachment=>({
      ...attachment,
      downloadUrl:`${this.config.get<string>('BACKEND_URL')}/attachments/${attachment.id}/download`
    }))
  }
}

  findOne(id: number) {
    return `This action returns a #${id} attachment`;
  }

  async download(attachmentId:string){
    const attachment = await this.attachmentRepo.findOne({
      where:{id:attachmentId}
    })
    if(!attachment) throw new NotFoundException('attachment not found')
    //create pdf
    const file = createReadStream(`./upload/attachments/${attachment.filename}`)
    return new StreamableFile(file,{length:attachment.fileSize,type: attachment.contentType})
  }
  
  update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    return `This action updates a #${id} attachment`;
  }

  async remove(attachmentId: string,userId:string) {
    //check if attachment exists or not
    const attachment = await this.attachmentRepo.findOne({where:{
      id: attachmentId,
    },relations:['uploadedBy','task','task.board','task.board.workspace']})
    if(!attachment) throw new NotFoundException('attachment not found')
    
    //check if user is admin of the workspace or the user is the uploader
    const workspaceMember = await this.workspaceRepo.findOne({
      where:{
        user:{id: userId},
        workspace:{id: attachment.task.board.workspace.id}
      }
    })

    if(!workspaceMember) throw new NotFoundException('member not in the workspace')
      
    if(workspaceMember.role !== WorkspaceMemberRoles.admin && workspaceMember.role !== WorkspaceMemberRoles.owner && attachment.uploadedBy.id !== userId){
      throw new ForbiddenException('Not Allowed Privilages')
    }

    if(fs.existsSync(attachment.storagePath)){
      fs.unlinkSync(attachment.storagePath)
    }

    await this.attachmentRepo.delete({
      id: attachmentId
    })
    return  {message:"attachment has been deleted successfully"};
  }
}
