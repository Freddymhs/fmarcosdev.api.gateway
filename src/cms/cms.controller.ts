import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CmsService } from './cms.service';

@ApiTags('Articles')
@Controller('articles')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get blog articles with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-indexed)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Articles per page',
    example: 15,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated articles from CMS',
  })
  @ApiResponse({ status: 500, description: 'CMS service unavailable' })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const size = parseInt(pageSize || '15', 10);
    return this.cmsService.getArticles(pageNum, size);
  }
}
