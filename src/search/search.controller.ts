import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service.ts';
import { JwtGuard } from '../auth/guard/jwt.guard.ts';
import { SearchQueryDto } from './dto/query-search.dto.ts';
import { type jwtPayload } from '../interface/jwt-payload.interface.ts';
import { User } from '../user/decorator/user.decorator.ts';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
@UseGuards(JwtGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search', description: 'Search for tasks, comments, attachments across the workspace' })
  @ApiQuery({ name: 'q', type: 'string', required: true, description: 'Search query string' })
  @ApiQuery({ name: 'type', type: 'string', required: false, description: 'Filter by item type (task, comment, etc)' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid search query' })
  globalSearch(
    @User() user: jwtPayload,
    @Query() searchQueryDto:SearchQueryDto
  ) {
  debugger
  console.log(user)
    return this.searchService.globalSearch(user.userId,searchQueryDto);
  }
}
