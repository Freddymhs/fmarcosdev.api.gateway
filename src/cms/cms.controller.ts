import { Controller, Get } from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('articles')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async findAll() {
    return this.cmsService.getArticles();
  }
}
