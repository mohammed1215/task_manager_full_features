import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseUUIDPipe,
    UseGuards,
    Patch,
    Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/decorator/user.decorator';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { AdminWorkspaceGuard } from '../Guards/admin.guard';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('Tags')
@Controller('')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Post('workspaces/:workspaceId/tags')
    @ApiOperation({
        summary: 'Create tag',
        description: 'Create a new tag for organizing tasks',
    })
    @ApiResponse({ status: 201, description: 'Tag created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 409, description: 'Tag already exists' })
    @ApiBody({ type: CreateTagDto })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), AdminWorkspaceGuard)
    create(
        @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
        @Body() createTagDto: CreateTagDto,
        @User() user: jwtPayload,
    ) {
        return this.tagService.create(workspaceId, createTagDto);
    }

    @Get('workspaces/:workspaceId/tags')
    @ApiOperation({
        summary: 'Get all tags',
        description: 'Retrieve all available tags',
    })
    @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    findAll(
        @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
        @User() user: jwtPayload,
    ) {
        return this.tagService.findAll(workspaceId, user.userId);
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.tagService.findOne(+id);
    // }

    @Patch('tags/:tagId')
    @UseGuards(AuthGuard('jwt'), AdminWorkspaceGuard)
    update(@Param('tagId') tagId: string, @Body() updateTagDto: UpdateTagDto) {
        return this.tagService.update(tagId, updateTagDto);
    }

    @Delete('tags/:tagId')
    @UseGuards(AuthGuard('jwt'), AdminWorkspaceGuard)
    remove(@Param('tagId') tagId: string) {
        return this.tagService.remove(tagId);
    }
}
