import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { SearchQueryDto } from './dto/query-search.dto';
import { type jwtPayload } from 'src/interface/jwt-payload.interface';
import { User } from 'src/user/decorator/user.decorator';
@Controller('search')
@UseGuards(JwtGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  globalSearch(
    @User() user: jwtPayload,
    @Query() searchQueryDto:SearchQueryDto
  ) {
    return this.searchService.globalSearch(user.userId,searchQueryDto);
  }
}
