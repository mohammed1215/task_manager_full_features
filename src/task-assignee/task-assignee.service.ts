import { Injectable } from '@nestjs/common';
import { CreateTaskAssigneeDto } from './dto/create-task-assignee.dto';
import { UpdateTaskAssigneeDto } from './dto/update-task-assignee.dto';

@Injectable()
export class TaskAssigneeService {
  create(createTaskAssigneeDto: CreateTaskAssigneeDto) {
    return 'This action adds a new taskAssignee';
  }

  findAll() {
    return `This action returns all taskAssignee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskAssignee`;
  }

  update(id: number, updateTaskAssigneeDto: UpdateTaskAssigneeDto) {
    return `This action updates a #${id} taskAssignee`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskAssignee`;
  }
}
