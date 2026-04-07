import { ForbiddenException, Injectable } from '@nestjs/common';
import { SearchQueryDto, SearchTypes } from './dto/query-search.dto';
import { ILike, In, Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo:Repository<Task>,
    @InjectRepository(Board) private readonly boardRepo:Repository<Board>,
    @InjectRepository(WorkspaceMember) private readonly workspaceMemberRepo:Repository<WorkspaceMember>,
  ){}
  async globalSearch(userId:string, searchQueryDto:SearchQueryDto){
    const start = performance.now()
    const { q, workspaceId, type, page = 1, limit = 20 } = searchQueryDto;
    const userMemberships = await this.workspaceMemberRepo.find({
      where: { user: { id: userId } },
      relations: ['workspace'],
    });
    console.log(searchQueryDto)
    const allowedWorkspaceIds = userMemberships.map(m=>m.workspace.id)

    if(workspaceId && !allowedWorkspaceIds.includes(workspaceId)){
      throw new ForbiddenException('not allowed to search for this workspace')
    }

    // The target workspaces to search within
    const targetWorkspaceIds = workspaceId ? [workspaceId] : allowedWorkspaceIds;

    // If they have no workspaces, return empty early
    if (targetWorkspaceIds.length === 0) {
      return { results: { tasks: [], boards: [] }, totalCount: 0, searchTimeMs: performance.now() - start };
    }

    let tasks:Task[] = [], taskCount = 0;
    let boards:Board[] = [], boardCount = 0;

    if (type === SearchTypes.ALL || type === SearchTypes.TASKS) {
      [tasks, taskCount] = await this.taskRepo.findAndCount({
        where: [
          { title: ILike(`%${q}%`), board: { workspace: { id: In(targetWorkspaceIds) } } },
          { description: ILike(`%${q}%`), board: { workspace: { id: In(targetWorkspaceIds) } } },
          { comment: { content: ILike(`%${q}%`) }, board: { workspace: { id: In(targetWorkspaceIds) } } } 
        ],
        relations: ['board', 'board.workspace','column'], 
        take: type === SearchTypes.ALL ? Math.floor(limit / 2) : limit,
        skip: (page - 1) * limit,
      });
    }

    if(type === SearchTypes.ALL || type === SearchTypes.BOARDS){
      [boards,boardCount] = await this.boardRepo.findAndCount({
        where:[
          {
            name: ILike(`%${q}%`),
            workspace: {id: In(targetWorkspaceIds)}
          },
          {
            description: ILike(`%${q}%`),
            workspace: {id:In(targetWorkspaceIds)}
          },
        ],
        relations: ['workspace'], 
        take: type === SearchTypes.ALL ? Math.ceil(limit / 2) : limit,
        skip: (page - 1) * limit,
      })
    }

    const finalTasks = tasks.map(task => ({
      id: task.id,
      taskNumber: task.taskNumber,
      title: task.title,
      snippet: task.description?.substring(0, 60) || 'No description...',
      boardName: task.board.name,
      workspaceName: task.board.workspace.name,
      column: task.column,
      priority: task.priority
    }));

    const finalBoards = boards.map(board => ({
      id: board.id,
      title: board.name,
      workspaceName: board.workspace.name,
      snippet: board.description?.substring(0, 60) || 'No description...',
    }));
    const end = performance.now()
    return {
     results: {
        tasks: finalTasks,
        boards: finalBoards
      },
      totalCount: Math.floor(taskCount + boardCount),
      searchTimeMs: end - start 
    }
  }
}
