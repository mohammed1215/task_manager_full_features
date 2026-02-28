import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PriorityTask, Task } from './entities/task.entity';
import { Between, DeepPartial, FindOptionsOrder, FindOptionsWhere, ILike, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { TaskAssignee } from 'src/task-assignee/entities/task-assignee.entity';
import { ColumnEntity } from 'src/column/entities/column.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { BoardService } from 'src/board/board.service';
import { FindTasksQueryDto } from './dto/find-task-query.dto';
import { BoardMember, BoardRoles } from 'src/board/entities/board-member.entity';
import { AssignUsersToTaskDto } from './dto/assign-users.dto';
import { TaskWatcher } from 'src/task-watcher/entities/task-watcher.entity';
import { Board } from 'src/board/entities/board.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { MoveTaskDto } from './entities/move-task.dto';
import { WorkspaceMemberRoles } from 'src/workspace-member/enum/WorkspaceMember.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
export interface FILTER {
  columnId:string|undefined,
  assigneeId:string|undefined,
  priority:PriorityTask|undefined,
  tagId:string|undefined,
  dueDateFrom:Date|undefined,
  dueDateTo:Date|undefined
}
@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) private readonly taskRepo:Repository<Task>,
    @InjectRepository(TaskAssignee) private readonly taskAssigneeRepo:Repository<TaskAssignee>,
    @InjectRepository(ColumnEntity) private readonly columnRepo:Repository<ColumnEntity>,
    @InjectRepository(Tag) private readonly tagRepo:Repository<Tag>,
    @Inject(forwardRef(()=>BoardService)) private readonly boardService:BoardService,
    @InjectRepository(TaskWatcher) private readonly taskWatcherRepo:Repository<TaskWatcher>,
    @InjectRepository(BoardMember) private readonly boardMemberRepo:Repository<BoardMember>,
    @InjectRepository(WorkspaceMember) private readonly workspaceMemberRepo:Repository<WorkspaceMember>,
    // private readonly mailService:MailService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly eventEmitter:EventEmitter2,
  ){}
  
  
  async create(userId:string,boardId:string,createTaskDto: CreateTaskDto) {
    //map the assigneeIds so we can assign the tasks for those people
    const {assigneeIds, tagIds , columnId, ...taskData} = createTaskDto
    const assignees = assigneeIds?.map((id)=>({user:{id}})) ?? []
    
    const tags = tagIds?.map((id) => ({ id })) ?? [];
    
    const board = await this.boardService.findOneBoard(boardId)
    const taskCount = await this.taskRepo.count({where: {board:{workspace:{id:board.workspace.id}}},relations:['board','board.workspace'],withDeleted:true})
    
    let resolvedColumnId = columnId;
    if (!resolvedColumnId) {
      const firstColumn = await this.columnRepo.
      createQueryBuilder('column')
      .where('"boardId" = :boardId',{boardId})
      .orderBy('position','ASC')
      .getOne()
      if (!firstColumn) throw new BadRequestException('Board has no columns');
      resolvedColumnId = firstColumn.id;
    }
    
    //check if tags exists
    if (createTaskDto.tagIds?.length) {
      const existingTags = await this.tagRepo.findBy({ 
        id: In(createTaskDto.tagIds) 
      });
      if (existingTags.length !== createTaskDto.tagIds.length) {
        throw new BadRequestException('One or more tags not found');
      }
    }
    

    //calculate position
    const taskPosition = await this.taskRepo.count({where:{column:{id:resolvedColumnId}}})

    const task =  this.taskRepo.create({
      ...taskData,
      column:{id:resolvedColumnId},
      board:{id:boardId},
      assignedTasks:assignees,
      createdBy:{id:userId},
      taskNumber:`Task-${taskCount+1}`,
      position:taskPosition,
      tags:tags,
      watchers: [{
        user:{id:userId}
      }],
    })
    
    return this.taskRepo.save(task);
  }

  async getCountOfTasksForSpecificColumn(boardId:string,columnId:string){
    const count = await this.taskRepo.count({where:{
      board:{id:boardId},
      column:{id:columnId}
    }})
    return count
  }

  async findAll(userId:string,boardId:string,filterDto:FindTasksQueryDto) {
  const { limit, page, columnId, assigneeId, priority, tagId, dueDateFrom, dueDateTo, search, sortBy, sortOrder } = filterDto;
    //check if user is in board
    const user = await this.boardService.findOneBoardMember(userId,boardId)
    
    const where: FindOptionsWhere<Task> = { board: { id: boardId } };

    if(columnId) where.column = {id: columnId}
    if(assigneeId) where.assignedTasks = {id: assigneeId}
    if(priority) where.priority = priority
    if(tagId) where.tags = {id: tagId}
    if(dueDateFrom && dueDateTo){
      where.dueDate = Between(dueDateFrom,dueDateTo)
    }else if(dueDateFrom){
      where.dueDate = MoreThanOrEqual(dueDateFrom)
    }else if(dueDateTo){
      where.dueDate = LessThanOrEqual(dueDateTo)
    }

    if(search){
      where.title = ILike(`%${search}%`);
      where.description = ILike(`%${search}%`)
    }

    const order:FindOptionsOrder<Task> = {};
    if(sortBy && sortOrder){
      order[sortBy] = sortOrder
    }

    // get all tasks from the board
    const [tasks,taskCount] = await this.taskRepo.findAndCount({
      where,
      order,
      take: limit,
      skip: (page-1)*limit,
    })
    
    return {tasks,taskCount,pageCount:Math.ceil(taskCount/limit)};
  }

  async findOne(userId:string,taskId: string) {
    const task = await this.taskRepo.findOne({where:{id:taskId},relations:{
      board:{
        workspace:true
      },
      assignedTasks:true,
      column:true,
      watchers:true,
      createdBy:true
    }})
    if(!task) throw new NotFoundException('task not found')
    const boardMember = await this.boardService.findOneBoardMember(userId,task.board.id)
    return task
  }

  async update(userId: string,taskId:string, updateTaskDto: UpdateTaskDto) {
    //desctruct the datas
    const {assigneeIds,columnId,tagIds,...taskData} = updateTaskDto

    // check if user admin or one of the assignees
    const assignee = await this.taskAssigneeRepo.findOne({where:{user:{id:userId},task:{id:taskId}}})
    const task = await this.findOne(userId,taskId)
    
    const admin = await this.boardService.findOneBoardMember(userId,task.board.id)
    if(admin.role !== BoardRoles.ADMIN && !assignee){
      throw new ForbiddenException('Not Allowed Privilages: only admins or assignees are the ones that are allowed to edit the task');
    }

    let completedAt: Date | undefined = undefined;
    // get done column and check if the id
    if(columnId) {
      const column = await this.columnRepo.findOne({where:{id:columnId}})
      if(column && column.name === 'Done'){
        completedAt = new Date();
      }
    }

    // update task assignees
    if(assigneeIds !== undefined){
      if(assigneeIds.length > 0){
        
        await this.taskAssigneeRepo.delete({task:{id:taskId}})
        
        const assignees = assigneeIds.map(assigneeId=>({
          task: {id: taskId},
          user: {id: assigneeId}
        }))
        
        const assigneesInserted = await this.taskAssigneeRepo.insert(assignees)
      }
    }

    //update tags
    if(tagIds !== undefined){
      if(tagIds.length>0){

        const result = await this.tagRepo.query(`
          delete from "task_tags"
          where "taskId" = $1
          `,[taskId])

        const tags = tagIds.map(id=>({
          taskId: {
            id: taskId
          },
          tagId:{
            id
          }
        }))
        
        await this.taskRepo.manager.createQueryBuilder()
        .insert()
        .into('task_tags',['taskId','tagId'])
        .values(tags)
        .execute()
      }
    }
    await this.taskRepo.update({
          id: taskId
        },{
          ...taskData,
          completedAt,
          column: columnId ? {id : columnId} : {id: task.column.id}
        }) ;
    return this.findOne(userId,taskId) 
  }

  async remove(userId:string, taskId: string) {
    // check if the userId is the task creator or admin+
    const task = await this.findOne(userId,taskId)
    const boardMember = await this.boardService.findOneBoardMember(userId,task.board.id)
    if(task.createdBy.id !== userId && boardMember.role !== BoardRoles.ADMIN){
      throw new ForbiddenException('Not Allowed Privilages: only admins or creator or the task is the one that is allowed to delete the task');      
    }
    const result = await this.taskRepo.softDelete({id: taskId})

    // 🔔  Notify Assignees and Watchers
    // TODO: Call your notification service or emit an event here
    // Example: this.eventEmitter.emit('task.deleted', { task, deletedBy: userId });
    return  {message:"task has been deleted successfully"};
  }

  //assign tasks to users
  async assignTask(userId:string,taskId:string,assignUsersToTaskDto:AssignUsersToTaskDto){
    //check user in board
    const task = await  this.taskRepo.findOne({where:{id:taskId},relations:['board','createdBy']})
    if(!task) throw new NotFoundException('task not found')

    const boardMember = await this.boardService.findOneBoardMember(userId,task.board.id)
    let values = assignUsersToTaskDto.assigneeIds.map(id=>({
      assignedBy: userId,
      task: {id:taskId},
      user: {id}
    }))

    if(boardMember.role === BoardRoles.VIEWER){
      throw new ForbiddenException('Not Allowed Privilages: Member+ are the ones allowed to assign people tasks')
    }

    //check if assigneeIds exists in board
    const boardMembers = await this.boardMemberRepo.find({
      where: {
        board: {id:task.board.id},
        user: In(assignUsersToTaskDto.assigneeIds)
      }
    })

    if(boardMembers.length !== new Set(assignUsersToTaskDto.assigneeIds).size){
      throw new BadRequestException('One or more users do not belong to this workspace')
    }

    // if user exists
    const insertedResult = await this.taskAssigneeRepo.createQueryBuilder('task_assignee')
    .insert()
    .into('task_assignee')
    .values([...values])
    .orIgnore()
    .returning('*')
    .execute()

    // map assignees to watchers
    let watcherList = assignUsersToTaskDto.assigneeIds.map<DeepPartial<TaskWatcher>>(assigneeId=>{
      return ({
        task: {id:taskId},
        user: {id:assigneeId},
      })
    })

    // add creator of task to the watchers if it doesn't exists
    watcherList.push({task:{id:taskId},user:{id:task.createdBy.id}})

    // add watchers
    const watchers = this.taskWatcherRepo.createQueryBuilder('task_watcher')
    .insert()
    .into('task_watcher')
    .values(watcherList)
    .orIgnore()
    .execute()

    // email notification
    const userIds = insertedResult.raw.map(row=>row.userId)
    let users:User[];
    if(userIds.length>0){

      // get emails
      users =  await this.userRepo.find({
        where: {
          id: In(userIds)
        }
      })
      
      for (const user of users) {
        // send notifications
        this.eventEmitter.emit('notification.task_assigned',{userId:user.id,
          email:user.email,
          emailPreference: user.emailPreference,
          taskTitle:task.title,
          taskId:task.id
        })
      }
    }

    const finalAssignees = await this.taskAssigneeRepo.find({
      where: { task: { id: taskId } },
      relations: ['user'] 
    });
    return {
      id: task.id,
      title: task.title,
      assignees: finalAssignees.map(a=>a.user) 
    }
  }

  async unassignTask(requestingUserId: string, taskId: string, userToUnassignId: string) {
    // Check if task exists and load relations (board)
    const task = await this.taskRepo.findOne({where:{id:taskId},relations:['board','assignedTasks','assignedTasks.user']})
    if(!task) throw new NotFoundException('task not found')

    // Authorize user role to be Member+
    const boardMember = await this.boardService.findOneBoardMember(requestingUserId,task.board.id)
    if(boardMember.role === BoardRoles.VIEWER){
      throw new ForbiddenException('Not Allowed Privilages: Member+ are the ones allowed to unassign people tasks')
    }

    // Check if userToUnassign exists in the task assignee
    const taskAssignee = await this.taskAssigneeRepo.findOne({
      where: {
        task: {id:taskId},
        user:{id:userToUnassignId}
      },
      relations: ['user']
    })
    if(!taskAssignee){
      throw new NotFoundException('user is not assigned to this task')
    }
    // Delete user from taskAssignee table
    const deleteResult = await this.taskAssigneeRepo.delete({task:{id:taskId},user:{id:userToUnassignId}})
    
    // Notify the user
    this.eventEmitter.emit('notification.task_unassigned',{
      userId:userToUnassignId,
      taskId,
      taskTitle:task.title,
      emailPreference:taskAssignee.user.emailPreference,
      email:taskAssignee.user.email,
    })
    //fetch other
    //Notify other users
    for (const assignee of task.assignedTasks) {
      this.eventEmitter.emit('notification.task_unassigned',{
      userId:assignee.user.id,
      taskId,
      taskTitle:task.title,
      emailPreference:taskAssignee.user.emailPreference,
      email:taskAssignee.user.email,
      username: assignee.user.firstname +' '+ assignee.user.lastname
    })
    }
    // Return success response
    return {message:"unassigned user to the task successfully"}
  }

  async moveTask(requestingUserId:string,taskId:string,moveTaskDto:MoveTaskDto){

    const task = await this.taskRepo.findOne({where:{id:taskId},relations:['column','board','board.workspace']})
    if(!task) throw new NotFoundException('task not found')

    // check requesting user to be one of the assignees or admin+ 
    // 1. try to find the requestingUserId in TaskAssignee Table
    // 2. not found? then check the workspace Member table if he is the admin or not
    // if yes then allow moving
    const isAssignee = await this.taskAssigneeRepo.findOne({
      where: {
        user: {id:requestingUserId},
        task: {id:taskId}
      }    
    })
    
    const isAdmin = await this.workspaceMemberRepo.findOne({
      where: {
        user: {
          id: requestingUserId,
        },
        workspace: {id:task.board.workspace.id},
      }
    })

    if((!isAdmin || (isAdmin && (isAdmin.role !== WorkspaceMemberRoles.admin && isAdmin.role !== WorkspaceMemberRoles.owner)))  && !isAssignee) throw new ForbiddenException('Not Allowed Privilages')

    // 3. COLUMN VALIDATION
    // "Can only move within same board"
    // We need to fetch the target column to make sure it belongs to task.column.board.id
    const column = await this.columnRepo.findOne({where:{id:moveTaskDto.columnId},relations:['board']})
    if(!column) throw new NotFoundException('column not found')
    
    if(column.board.id !== task.board.id){
      throw new BadRequestException('can only move tasks inside same board')
    }
    // 4. THE DRAG AND DROP MATH (Reordering positions)
    // DIFFERENT COLUMN
    if(column.id !== task.column.id){
      let oldPosition = task.position;
      let newPosition = moveTaskDto.position;
      // update oldColumn tasks to move up position - 1
      await this.taskRepo.createQueryBuilder()
      .update('task')
      .set({position: ()=>'position - 1'})
      .where('columnId = :columnId',{columnId:task.column.id})
      .andWhere('position > :taskPosition',{taskPosition: oldPosition})
      .execute()
      
      // update new column tasks for the position (moving the tasks for the new position to the right)
      await this.taskRepo.createQueryBuilder()
      .update('task')
      .set({position: ()=> 'position + 1'})
      .where('columnId = :columnId',{columnId: moveTaskDto.columnId})
      .andWhere('position >= :newPosition',{newPosition})
      .execute()

      // update task column
      task.column = column
      if(column.name === 'Done'){
        task.completedAt = new Date();
      }
      task.position = newPosition;
      
      await this.taskRepo.save(task)
    }
    //SAME COLUMN
    else{
      // if the old position < new position
      //shift task down (right)
      //shift between tasks up (left)
      let oldPosition = task.position;
      let newPosition = moveTaskDto.position;
    
      if(oldPosition<newPosition){
        await this.taskRepo.createQueryBuilder('task')
        .update('task')
        .set({position: ()=>'position - 1'})
        .where('columnId = :columnId',{columnId:task.column.id})
        .andWhere('position > :oldPosition',{oldPosition})
        .andWhere('position <= :newPosition',{newPosition})
        .execute()
      }else if(oldPosition>newPosition){
         await this.taskRepo.createQueryBuilder('task')
        .update('task')
        .set({position: ()=> 'position + 1'})
        .where('columnId = :columnId',{columnId:task.column.id})
        .andWhere('position >= :newPosition',{newPosition})
        .andWhere('position < :oldPosition',{oldPosition})
        .execute()
      }

      task.position = newPosition;
      await this.taskRepo.save(task)
    }
    //TODO
    // 5. UPDATE TASK
    
    // 6. LOG ACTIVITY & NOTIFY WATCHERS
    return {message:"task moved successfully"}
  }

  findAllWithoutConditions(){
    const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
    // const dayAfterTomorrow = tomorrow + 24 * 60 * 60 * 1000;
    
    return this.taskAssigneeRepo.find({
      where: {
        task: {
          dueDate:Between(new Date(), new Date(tomorrow)),
          completedAt:IsNull()
        }
      }
    ,relations:['task','user','task.board']})
  }

  findOverdueTasks(){
    return this.taskAssigneeRepo.find({
      where: {
        task:{
          dueDate:LessThan(new Date()),
          completedAt:IsNull()
        },
        
      }
    ,relations:['task','user','task.board']})
  }
}
