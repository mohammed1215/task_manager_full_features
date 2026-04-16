import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    DefaultValuePipe,
    ParseIntPipe,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User } from '../user/decorator/user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { ParsePositivePipe } from '../Pipes/parse-positive.pipe';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Activity')
@ApiBearerAuth()
@Controller('activity')
@UseGuards(JwtGuard)
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Post()
    @ApiOperation({
        summary: 'Create activity',
        description: 'Log a new activity',
    })
    @ApiResponse({ status: 201, description: 'Activity created successfully' })
    @ApiBody({ type: CreateActivityDto })
    create(@Body() createActivityDto: CreateActivityDto) {
        return this.activityService.create(createActivityDto);
    }

    @Get('tasks/:taskId/activity')
    @ApiOperation({
        summary: 'Get task activity log',
        description: 'Retrieve activity log for a specific task',
    })
    @ApiParam({ name: 'taskId', type: 'string', description: 'Task UUID' })
    @ApiQuery({
        name: 'page',
        type: 'number',
        required: false,
        example: 1,
        description: 'Page number',
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false,
        example: 20,
        description: 'Items per page',
    })
    @ApiResponse({
        status: 200,
        description: 'Activity log retrieved successfully',
    })
    @ApiResponse({ status: 404, description: 'Task not found' })
    findAll(
        @User(JwtGuard) user: jwtPayload,
        @Param('taskId') taskId: string,
        @Query(
            'page',
            new DefaultValuePipe(1),
            ParseIntPipe,
            new ParsePositivePipe(true),
        )
        page: number,
        @Query(
            'limit',
            new DefaultValuePipe(20),
            ParseIntPipe,
            new ParsePositivePipe(true),
        )
        limit: number,
    ) {
        return this.activityService.findAll(user.userId, taskId, page, limit);
    }

    // @Post('tasks/:taskId/activity')

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.activityService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    //   return this.activityService.update(+id, updateActivityDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.activityService.remove(+id);
    // }
}
