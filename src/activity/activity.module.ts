import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service.ts';
import { ActivityController } from './activity.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity.ts';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports:[TypeOrmModule.forFeature([Activity])]
})
export class ActivityModule {}
