import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CmsService } from './cms.service';

@Module({
  imports: [HttpModule],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
