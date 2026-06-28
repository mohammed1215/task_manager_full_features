import { Injectable } from '@nestjs/common';
// import { CreateTaskWatcherDto } from './dto/create-task-watcher.dto';
// import { UpdateTaskWatcherDto } from './dto/update-task-watcher.dto';

@Injectable()
export class TaskWatcherService {
    // create(createTaskWatcherDto: CreateTaskWatcherDto) {
    //     return 'This action adds a new taskWatcher';
    // }

    findAll() {
        return `This action returns all taskWatcher`;
    }

    // findOne(id: number) {
    //   return `This action returns a #${id} taskWatcher`;
    // }

    // update(id: number, updateTaskWatcherDto: UpdateTaskWatcherDto) {
    //     return `This action updates a #${id} taskWatcher`;
    // }

    remove(id: number) {
        return `This action removes a #${id} taskWatcher`;
    }
}
