import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CmsService } from './cms.service';

@ApiTags('Articles')
@Controller('articles')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blog articles' })
  @ApiResponse({
    status: 200,
    description: 'Returns all published articles from CMS',
  })
  @ApiResponse({ status: 500, description: 'CMS service unavailable' })
  async findAll() {
    return this.cmsService.getArticles();
  }
}
