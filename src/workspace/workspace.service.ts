import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import slugify from 'slugify';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { WorkspaceMemberRoles } from 'src/workspace-member/enum/WorkspaceMember.enum';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { Invitation } from './entities/invitation.entity';
import { QueryRunner,DataSource } from 'typeorm';
import { Activity, ActivityTypes } from 'src/activity/entities/activity.entity';
@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace) private readonly workspaceRepo:Repository<Workspace>,
    @InjectRepository(WorkspaceMember) private readonly workspaceMemberRepo:Repository<WorkspaceMember>,
    @InjectRepository(Invitation) private readonly invitationRepo:Repository<Invitation>,
    @InjectRepository(Activity) private readonly activityRepo:Repository<Activity>,
    private readonly dataSource:DataSource,
    private readonly mailService: MailService,
    private readonly userService:UserService,
  ){}
  async create(userId:string,createWorkspaceDto: CreateWorkspaceDto) {
    //create slug
    const slug = slugify(createWorkspaceDto.name,{lower:true})
    
    //create workspace
    const workspace = this.workspaceRepo.create({...createWorkspaceDto,slug,owner:{id:userId}})
    
    //save workspace
    const savedWorkspace = await this.workspaceRepo.save(workspace)

    //create workspace_member
    const workspaceMember = this.workspaceMemberRepo.create({
      user:{id: userId},
      workspace:savedWorkspace,
      role: WorkspaceMemberRoles.owner,
      invitedBy: { id: userId },
    })
    const savedWorkspaceMember = await this.workspaceMemberRepo.save(workspaceMember)
    return {
      id:workspace.id,
      name: workspace.name,
      slug:workspace.slug,
      description: workspace.description,
      isPrivate:workspace.isPrivate,
      ownerId:workspace.owner.id,
      createdAt: workspace.createdAt,
      memberCount: 1
    };
  }

 async findAll(userId:string,limit:number,page:number,filter:'owned'|'member'|'all') {
    // validate that no negative allowed
    limit = Math.max(Math.max(1,limit),100)
    page = Math.max(1,page)

    //define query variable
    let query:FindOptionsWhere<Workspace> = {};

    // filter based on role owner, member or all
    if(filter === 'owned'){
      query = {...query,members:{
        user:{
          id:userId
        },
        role : WorkspaceMemberRoles.owner
      }} 
    }else if(filter === 'member'){
       query = {...query,members:{
        user:{
          id:userId
        },
        role : WorkspaceMemberRoles.member
      }} 
    }else {
       query = {...query, members:{user:{id:userId}}} 
    }

    const [workspaces,count]= await this.workspaceRepo.findAndCount({
      where:query,
      take:limit,
      skip: (page - 1) * limit
    });

    return {workspaces,workspaceCount:count,pageCount: Math.ceil(count/limit)} 
  }

 async findOne(workspaceId: string) {
    const workspace = await this.workspaceRepo.findOne({
      where: {
        id:workspaceId,
      }
    });
    if(!workspace) throw new NotFoundException('workspace not found')
    return workspace
  }

  async update(userId:string,workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const dbPayload:any = {...updateWorkspaceDto}
    if(updateWorkspaceDto?.name){
      dbPayload.slug = slugify(updateWorkspaceDto.name,{lower:true})
    }

    const member = await this.workspaceMemberRepo.findOne({where:{workspace:{id:workspaceId},user:{id:userId}}})
    if(!member) throw new NotFoundException('member not found')

      if(member.role !== WorkspaceMemberRoles.owner&& member.role !== WorkspaceMemberRoles.admin){
        throw new ForbiddenException('Not Allowed Privilages: Owner is the one allowed to update the workspace')
      }
    
    const updateResult = await this.workspaceRepo.update({id: workspaceId},{...dbPayload})
    if(!updateResult.affected) throw new NotFoundException("workspace not found")
    
    // activity
    // const activity = this.activityRepo.create({activityType:ActivityTypes.updated,fieldName:'update workspace details',actor:{id:userId},task:})
    // this.activityRepo.save(activity)
    return {message:"workspace has been updated successfully"};
  }

async removeWorkspace(userId:string,workspaceId:string, confirmation:string){
  if(!confirmation) throw new BadRequestException('Please Confirm Deletion')

  const member =await this.workspaceMemberRepo.findOne({where: {user:{id:userId},workspace:{id:workspaceId}}})
  if(!member) throw new NotFoundException('member not found in the workspace');

  if(member.role !== WorkspaceMemberRoles.owner) throw new ForbiddenException('Not Allowed Privilages: Owner is the only one allowed to delete the workspace')
  const workspace = await this.findOne(workspaceId);

  if(confirmation!== workspace.name) throw new BadRequestException('Please write the workspace name correctly')
    
  const result = await this.workspaceRepo.delete({id:workspaceId})
  
  if(!result.affected) throw new NotFoundException('workspace not found')
  const members = await this.workspaceMemberRepo.find({where: {workspace:{id:workspaceId}},relations:['user']})

  for (const member of members) {
    await this.mailService.sendNotifyDeletionEmail(member.user.email,confirmation)
  }

    return {message:"workspace has been deleted successfully"}
}

  async findMembersForOneWorkspace(workspaceId:string){
    return this.workspaceMemberRepo.find({
      where:{
        workspace:{
          id: workspaceId
        }
      },
      relations:['user']
    })
  }

  async updateMembersPrivilages(workspaceId:string,currentUserId:string,memberId:string,role:Exclude<WorkspaceMemberRoles,'owner'>){
    // check privilages of the current user if he is owner he is allowed to edit the privilages of the other members
    const owner = await this.workspaceMemberRepo.findOne({where:{
      workspace:{id:workspaceId},
      user:{id:currentUserId}
    }})
    if(!owner) throw new NotFoundException('owner not found')
    if(owner.role !== WorkspaceMemberRoles.owner){
      throw new ForbiddenException('Not Allowed Privilages')
    }

    if(currentUserId === memberId) throw new BadRequestException('Not Allowed to update owner role')

    const result = await this.workspaceMemberRepo.update({user:{id:memberId}},{role})
    if(result.affected === 0) throw new NotFoundException('member not found')
      return {message:"user role updated successfully"}
  }

  async remove(workspaceId: string,userId:string,currentUserId:string) {

    // logic of if the user is the one that is deleting itself(userId === currentUserId)
    // check for the role if it was member delete it normally
    if(userId === currentUserId){
      const member = await this.workspaceMemberRepo.findOne({where:{workspace:{id:workspaceId},user:{id:userId}}})
      if(!member) throw new NotFoundException('member not found')

      //if the role was an owner check for the count of the members in the workspace that are admin if they were greater than 1 then delete it else remove it
      if(member.role === WorkspaceMemberRoles.owner){
        const count = await this.workspaceMemberRepo.count({where:{workspace:{id:workspaceId},role:WorkspaceMemberRoles.owner}})
        if(count<=1){
          throw new BadRequestException('cannot delete last owner');
        }
        const result = await this.workspaceMemberRepo.delete({id:member.id})
        return "user deleted from workspace successfully"
      }else{
        const result = await this.workspaceMemberRepo.delete({id:member.id})
        return "user deleted from workspace successfully"
      }
    }

    //logic of if the user is the owner and it try to remove someone from the workspace
    // find user using workspacemember table to get its role and check if its role is owner , if the member is owner delete the user he asked for normally
    const owner = await this.workspaceMemberRepo.findOne({where: { workspace: {id:workspaceId},user:{id:currentUserId}}})
    if(!owner) throw new NotFoundException('owner not found')

    if(owner.role === WorkspaceMemberRoles.owner){
      const result = await this.workspaceMemberRepo.delete({workspace:{id:workspaceId},user:{id:userId},role:Not(WorkspaceMemberRoles.owner)})
      if(!result.affected) throw new NotFoundException('user not found');
      return "user has been removed from workspace successfully"
    }else{
      throw new ForbiddenException("Forbidden: Not Allowed Privilages")
    }
  }

  async inviteMember(workspaceId:string,senderId:string,createInvitationDto:CreateInvitationDto){
    // check the role of the sender
    const sender = await this.workspaceMemberRepo.findOne({where:{user:{id:senderId},workspace:{id:workspaceId}}})
    if(!sender) throw new NotFoundException('Sender not found')

    if(sender.role !== WorkspaceMemberRoles.admin && sender.role !== WorkspaceMemberRoles.owner){
      throw new UnauthorizedException(`only owner and admin can invite members`)
    }

    // find if email in the database or not
    const user = await this.userService.findUserByEmail(createInvitationDto.email)
    if(!user) throw new NotFoundException('email is not found')

    //check if workspace exists
    const workspace = await this.findOne(workspaceId)

    //check if user is already in the workspace or not
    const existedUser = await this.workspaceMemberRepo.findOne({where:{user:{id:user.id}},relations:['workspace']})
    if(existedUser) throw new BadRequestException('user already exists in the workspace')
    
    // create transation
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
      try {
        //create invitation and save it into database
        const invitation = queryRunner.manager.create(Invitation, {
          sender:{id:senderId},
          invitedUser:{id: user.id},
          workspace: {id: workspaceId},
          role: createInvitationDto.role,
          message: createInvitationDto.message,
          deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        })

        const savedInvitation = await queryRunner.manager.save(Invitation,invitation)
        //send invitation email
        const result= await this.mailService.sendInvitationEmail(user.email,workspace.name,savedInvitation.id,senderId)
        await queryRunner.commitTransaction()
        return {message:"sent invitation email successfully",invitation}
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      }finally{
        await queryRunner.release()
      }
  }

  async acceptInvitation(invitationId:string,userId:string,senderId:string){
    // find invitation
    const invitation = await this.invitationRepo.findOne({where: {
      id: invitationId,
      invitedUser: {id: userId}
    },relations:['invitedUser','workspace','sender']})
    
    if(!invitation){
      throw new NotFoundException('invite not found')
    }

    if(invitation.deadline < new Date()){
      throw new BadRequestException('invitation is expired')
    }
    const queryRunner =  this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      // delete invitation
      await queryRunner.manager.delete(Invitation,{id:invitationId})  
      
      // add member to workspace member
      const workspaceMember =  queryRunner.manager.create(WorkspaceMember,{
        user:{
          id: invitation.invitedUser.id,
        },
        workspace: {
          id: invitation.workspace.id
        },
        invitedBy: {
          id: invitation.sender?.id
        },
        role: invitation.role
      })
      const savedWorkspaceMember = await queryRunner.manager.save(WorkspaceMember,workspaceMember)
      await queryRunner.commitTransaction()
      return savedWorkspaceMember
    } catch (error) {
      await queryRunner.rollbackTransaction()
     throw error 
    }finally{
      await queryRunner.release()
    }
  }
}
