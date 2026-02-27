import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { User } from 'src/user/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { ParsePositivePipe } from 'src/Pipes/parse-positive.pipe';

@Controller('activity')
@UseGuards(JwtGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get('tasks/:taskId/activity')
  findAll(
    @User(JwtGuard) user:jwtPayload,
    @Param('taskId') taskId:string,
    @Query('page',new DefaultValuePipe(1), ParseIntPipe,new ParsePositivePipe(true)) page:number,
    @Query('limit',new DefaultValuePipe(20), ParseIntPipe,new ParsePositivePipe(true)) limit:number,
  ) {
    return this.activityService.findAll(user.userId,taskId,page,limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
