import { Injectable } from '@nestjs/common';
import { CreateTaskTagDto } from './dto/create-task-tag.dto';
import { UpdateTaskTagDto } from './dto/update-task-tag.dto';

@Injectable()
export class TaskTagsService {
  create(createTaskTagDto: CreateTaskTagDto) {
    return 'This action adds a new taskTag';
  }

  findAll() {
    return `This action returns all taskTags`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} taskTag`;
  // }

  update(id: number, updateTaskTagDto: UpdateTaskTagDto) {
    return `This action updates a #${id} taskTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskTag`;
  }
}
