import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember) private readonly workspaceMemberRepo:Repository<WorkspaceMember>,

  ){}
  create(createWorkspaceMemberDto: CreateWorkspaceMemberDto) {
    return 'This action adds a new workspaceMember';
  }

  findAll() {
    return `This action returns all workspaceMember`;
  }

  async findOne(workspaceId: string,memberId:string) {
    const member = await this.workspaceMemberRepo.findOne({where:{workspace: {id:workspaceId},user:{id:memberId}}})
    if(!member) throw new NotFoundException('Member Not Found')
    return member;
  }

  update(id: number, updateWorkspaceMemberDto: UpdateWorkspaceMemberDto) {
    return `This action updates a #${id} workspaceMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspaceMember`;
  }
}
