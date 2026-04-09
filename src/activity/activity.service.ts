import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
  ) {}

  create(createActivityDto: CreateActivityDto) {
    return 'This action adds a new activity';
  }

  async findAll(userId: string, taskId: string, page: number, limit: number) {
    const [activities, count] = await this.activityRepo.findAndCount({
      where: {
        task: { id: taskId },
      },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['task', 'actor'],
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      activities,
      pageCount: Math.ceil(count / limit),
      repoCount: count,
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} activity`;
  // }

  // update(id: number, updateActivityDto: UpdateActivityDto) {
  //   return `This action updates a #${id} activity`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} activity`;
  // }
}
