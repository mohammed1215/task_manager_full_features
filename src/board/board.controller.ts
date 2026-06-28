import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
    ParseEnumPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from '../user/decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { JwtGuard } from '../auth/guard/jwt.guard';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { BoardFilter, Visibility } from '../enum/enum';
import { ColumnEntity } from '../column/entities/column.entity';
import { Task } from '../task/entities/task.entity';
import { Workspace } from '../workspace/entities/workspace.entity';
import { BoardMember } from './entities/board-member.entity';
import { Board } from './entities/board.entity';
import { User as UserType } from '../user/entities/user.entity';

@ApiTags('Boards')
@ApiBearerAuth()
@Controller('workspaces')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post(':workspaceId/boards')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Create a new board',
        description: 'Create a new board in a workspace',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
    @ApiResponse({ status: 201, description: 'Board created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: CreateBoardDto })
    create(
        @Param('workspaceId') workspaceId: string,
        @Body() createBoardDto: CreateBoardDto,
        @User() user: jwtPayload,
    ): Promise<{
        message: string;
        board: {
            columns: ColumnEntity[];
            id: string;
            name: string;
            description: string;
            backgroundColor: string;
            isArchived: boolean;
            createdAt: Date;
            updatedAt: Date;
            archivedAt: Date | null;
            visibility: Visibility;
            deletedAt: Date;
            createdBy: UserType;
            workspace: Workspace;
            members: BoardMember[];
            tasksOfBoard: Task[];
        };
    }> {
        return this.boardService.create(
            user.userId,
            workspaceId,
            createBoardDto,
        );
    }

    @Get(':workspaceId/boards')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Get all boards in workspace',
        description:
            'Retrieve paginated list of boards in a workspace with optional filtering',
    })
    @ApiParam({
        name: 'workspaceId',
        type: 'string',
        description: 'Workspace UUID',
    })
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
        example: 10,
        description: 'Items per page',
    })
    @ApiQuery({
        name: 'filter',
        enum: BoardFilter,
        required: false,
        description: 'Filter by board status',
    })
    @ApiResponse({
        status: 200,
        description: 'Boards retrieved successfully',
        type: Board,
        isArray: true,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Workspace not found' })
    findAll(
        @Param('workspaceId') workspaceId: string,
        @User() user: jwtPayload,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query(
            'filter',
            new DefaultValuePipe(BoardFilter.ALL),
            new ParseEnumPipe(BoardFilter),
        )
        filter: 'all' | 'archived' | 'active',
    ): Promise<Board[]> {
        return this.boardService.findAll(
            user.userId,
            workspaceId,
            page,
            limit,
            filter,
        );
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.boardService.findOne(+id);
    // }
}
