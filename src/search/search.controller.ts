import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { SearchQueryDto } from './dto/query-search.dto';
import { type jwtPayload } from '../interface/jwt-payload.interface';
import { User } from '../user/decorator/user.decorator';
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
