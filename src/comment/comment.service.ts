import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Task } from 'src/task/entities/task.entity';
import { BoardService } from 'src/board/board.service';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board/entities/board-member.entity';
import { WorkspaceMemberRoles } from 'src/workspace-member/enum/WorkspaceMember.enum';
import { TaskWatcher } from 'src/task-watcher/entities/task-watcher.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepo:Repository<Comment>,
    @InjectRepository(Task) private readonly taskRepo:Repository<Task>,
    @InjectRepository(BoardMember) private readonly boardRepo:Repository<BoardMember>,
    private readonly boardService:BoardService,
    @InjectRepository(WorkspaceMember) private readonly workMemberRepo:Repository<WorkspaceMember>,
    @InjectRepository(TaskWatcher) private readonly taskWatcherRepo:Repository<TaskWatcher>,
    private readonly eventEmitter:EventEmitter2
  ){}
  
  // TODO: Comment supports plain text and mentions (@username)
  async create(userId:string,taskId:string,createCommentDto: CreateCommentDto) {

    const {mentionedUserIds, ...commentData} = createCommentDto

    //check if task exists
    const task = await this.taskRepo.findOne({where:{id:taskId},relations:['board','board.workspace','column','assignedTasks']})
    if(!task) throw new NotFoundException('task not found')
    
    // check if user is member+ in the board or admin or owner of the workspace
    const isBoardMember = await this.boardRepo.findOne({where:{
      board: {id: task.board.id},
      user: {id:userId}
    }})

    const isWorkspaceMemberAdminOrOwner = await this.workMemberRepo.findOne({where:[
      {
      user: {id:userId},
      workspace: {id:task.board.workspace.id},
      role: WorkspaceMemberRoles.admin
    },
    {
      user: {id:userId},
      workspace: {id:task.board.workspace.id},
      role: WorkspaceMemberRoles.owner 
    }
    ]})

    if(!isWorkspaceMemberAdminOrOwner && !isBoardMember){
      throw new ForbiddenException('Not Allowed Privilages')
    }

    // create comment
    const comment = this.commentRepo.create({
      author: {id:userId},
      ...commentData,
      task: {id: taskId},
    })

    const savedComment = this.commentRepo.save(comment)

    // TODO: send notification for mentioned users


    //TODO: send notification for watchers
    const watchers = await this.taskWatcherRepo.find({
      where:{
        task: {id: taskId},
      }
    })

    for (const watcher of watchers) {
      if(watcher.user.id !== userId){
        this.eventEmitter.emit('notification.watched_task_comment',{userId:watcher.user.id,taskId,taskTitle:task.title})
      }
      
    }

    return savedComment;
  }

  findAll(taskId:string,page:number,limit:number) {
    
    return this.commentRepo.find({
      where:{
        task: {id:taskId},
      },
      relations: ['author'],
      order:{
        createdAt: 'DESC'
      },
      take: limit,
      skip: (page - 1) * limit
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  //TODO: MENTIONS
  async update(authorId:string,commentId:string,updateCommentDto:UpdateCommentDto) {
    const {mentionedUserIds,...updateCommentData} = updateCommentDto
    // check if comment exists
    const comment = await this.commentRepo.findOne({where: {
      id: commentId,
    },relations: ['author']})
    if(!comment) throw new NotFoundException('comment not found')

    // validation for author
    if(comment.author.id !== authorId){
      throw new ForbiddenException('Not Comment Author')
    }

    // validation for comment time
    if(comment.createdAt.getTime() + 15 * 60 * 1000 > new Date().getTime()){
      throw new BadRequestException('can not update comment after 15m of creation')
    }

    // update comment
    await this.commentRepo.update({id:commentId},{...updateCommentData,isEdited:true});
    return {message:"comment updated successfully"}
  }

  async remove(userId: string, commentId:string) {
    // check if comment exists
    const comment = await this.commentRepo.findOne({where:{
      id: commentId,
    },relations:['author','task','task.board','task.board.workspace']})

    if(!comment) throw new NotFoundException('comment not found')
    
      //get user
      const workspaceMember = await this.workMemberRepo.findOne({where:{user:{id:userId},workspace:{id:comment.task.board.workspace.id}}})
      if(!workspaceMember) throw new NotFoundException('member not in the workspace')
      if(userId !== comment.author.id && workspaceMember.role !== WorkspaceMemberRoles.admin && workspaceMember.role !== WorkspaceMemberRoles.owner){
        throw new ForbiddenException('not allowed privilages: only author of the comment or owner or admin of the workspace can delete the comment')
      }

      await this.commentRepo.delete({
        id:commentId
      })
      
    return {message:"comment has been deleted successfully"};
  }
}
