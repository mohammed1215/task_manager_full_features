import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, DefaultValuePipe, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { WorkspaceMemberRoles } from 'src/workspace-member/enum/WorkspaceMember.enum';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@User() user:jwtPayload,@Body() createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = await (this.workspaceService.create(user.userId,createWorkspaceDto))
    return workspace
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll(
    @User() user:jwtPayload,
    @Query('limit',new DefaultValuePipe(20),ParseIntPipe) limit:number,
    @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
    @Query('filter',new DefaultValuePipe('all')) filter:'owned'|'member'|'all',
  ) {
    return this.workspaceService.findAll(user.userId,limit,page,filter);
  }

  @Patch(':workspaceId')
  @UseGuards(JwtGuard)
  update(@User() user:jwtPayload,
  @Param('workspaceId') workspaceId:string,
  @Body() updateWorkspaceDto:UpdateWorkspaceDto){
   return this.workspaceService.update(user.userId,workspaceId,updateWorkspaceDto)
  }

  @Delete(':workspaceId')
  @UseGuards(JwtGuard)
  removeWorkspace(
    @Param('workspaceId') workspaceId:string,
    @User() user:jwtPayload,
    @Body('confirmation') confirmation:string
  ){
    return this.workspaceService.removeWorkspace(user.userId,workspaceId,confirmation)
  }
  

  @Get(':workspaceId/members')
  findMembers(@Param('workspaceId') workspaceId: string) {
    return this.workspaceService.findMembersForOneWorkspace(workspaceId);
  }

  @Patch(':workspaceId/members/:userId')
  updateMembersPrivilages(@Param('workspaceId') workspaceId: string,@User() currentUser:jwtPayload, @Param('userId') userId:string,@Body('role') role:Exclude<WorkspaceMemberRoles,'owner'>) {
    const allowedRoles = Object.values(WorkspaceMemberRoles).filter((role)=>role !== 'owner')
    if(!allowedRoles.includes(role)) throw new BadRequestException('allowed roles should be admin|member|viewer')
    return this.workspaceService.updateMembersPrivilages(workspaceId,currentUser.userId,userId,role);
  }

  @Delete(':workspaceId/members/:userId')
  @UseGuards(JwtGuard)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('userId') userId:string,
    @User() currentUser:jwtPayload,
  ) {
    return this.workspaceService.remove(workspaceId,userId,currentUser.userId);
  }

  @Post(':workspaceId/invitations')
  @UseGuards(JwtGuard)
  inviteMember(
    @Param('workspaceId') workspaceId:string,
    @User() user:jwtPayload,
    @Body() createInvitationDto:CreateInvitationDto){
    return this.workspaceService.inviteMember(workspaceId,user.userId,createInvitationDto)
  }

  @Post('accept-invitation')
  @UseGuards(JwtGuard)
 async acceptInvitation(
   @Query('invitationId') invitationId:string,
   @Query('senderId') senderId:string,
   @User() user:jwtPayload,
  ){
    const workspaceMember = await this.workspaceService.acceptInvitation(invitationId,user.userId,senderId)
    return {
      message:"accepted invitation successfully"
    }
  }
}
