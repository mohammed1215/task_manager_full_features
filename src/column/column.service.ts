import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnEntity } from './entities/column.entity';
import { Between, Not, Repository } from 'typeorm';
import { BoardService } from 'src/board/board.service';
import { BoardRoles } from 'src/board/entities/board-member.entity';
import { ReOrderColumnDto } from './dto/reorder-column.dto';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnEntity) private readonly columnRepo:Repository<ColumnEntity>,
    @Inject(forwardRef(()=>BoardService)) private readonly boardService: BoardService,
    private readonly taskService:TaskService
  ){}
  async create(userId:string,boardId:string,createColumnDto: CreateColumnDto) { 
    //find board member
    const boardMember = await this.boardService.findOneBoardMember(userId,boardId)

    //check the boardMember roles 
    // if member was not admin then  throw ForbidenError    
    if(boardMember.role !== BoardRoles.ADMIN){
      throw new ForbiddenException('Not Allowed Privilages: Only Admin Are allowed')
    }

    //else get columns and check if the number of columns in the board is not max(10)
    const columnCount = await this.columnRepo.count({where:{board:{id:boardId}}})
    if(columnCount>=10){
      throw new BadRequestException(`number of columns are max (${columnCount}/10)`)
    }

    //create column and save it in the database
    const column =  this.columnRepo.create({...createColumnDto,board: {id: boardId},position:columnCount});
    
    return this.columnRepo.save(column)
  }

  findAll() {
    return `This action returns all column`;
  }

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  async update(boardId: string,columnId:string,userId:string, updateColumnDto: UpdateColumnDto) {
    //check if user is member of columns
    const boardMember = await this.boardService.findOneBoardMember(userId,boardId)
    
    if(boardMember.role !== BoardRoles.ADMIN){
      throw new ForbiddenException('Not Allowed Privilages: Only Admin Are allowed')
    }
    const result = await this.columnRepo.update({board:{id:boardId},id:columnId},{...updateColumnDto});
    if(!result.affected) throw new NotFoundException('column not found')
      return {message:"column name has been updated successfully"}
  }

  async reorder(userId:string,boardId:string,reOrderColumnDto:ReOrderColumnDto){
    //check if user exists in the board
    const member = await this.boardService.findOneBoardMember(userId,boardId)

    //if member exists in the board check its role
    if(member.role !== BoardRoles.ADMIN){
      throw new ForbiddenException('Not Allowed Privilages: Only Admin Are allowed')
    }

    //reorder logic
    //get column
    const column = await this.columnRepo.findOne({where:{id:reOrderColumnDto.columnId}})
    if(!column) throw new NotFoundException('column does not exist')
      
    const from = reOrderColumnDto.newPosition >= column.position?column.position+1:reOrderColumnDto.newPosition
    const to = reOrderColumnDto.newPosition >= column.position?reOrderColumnDto.newPosition:column.position-1
    
    // get columns between new position and old position
    const columns = await this.columnRepo.find({where:{position: Between(from,to),board:{id:boardId}}})

    // check the old position of the column
    // if new position > old position
    // shift specific column right and shift other columns left
    // if new position < old position
    // shift specific column left and shift other columns right
    for (const otherColumn of columns) {
      if(reOrderColumnDto.newPosition > column.position){
        otherColumn.position--;
      }else if(reOrderColumnDto.newPosition < column.position){
        otherColumn.position++;
      }
    }
    column.position = reOrderColumnDto.newPosition;

    await this.columnRepo.save(columns)
    await this.columnRepo.save(column)
  }

  async remove(userId:string,boardId:string,columnId:string) {
    const member = await this.boardService.findOneBoardMember(userId,boardId)

    if(member.role !== BoardRoles.ADMIN){
      throw new ForbiddenException('Not Allowed Privilages: Only Admin Are allowed')
    }

    //TODO: find counts tasks in column
    // if there exists tasks then don't delete
    const taskCount = await this.taskService.getCountOfTasksForSpecificColumn(boardId,columnId)
    if(taskCount) throw new BadRequestException('Can not delete column with existing tasks') 

    // delete column
    const deletedResult = await this.columnRepo.delete({id:columnId,board:{id:boardId}})
    if(!deletedResult.affected) throw new NotFoundException('column not found')

    return{message:"column has been deleted successfully"} ;
  }
}
