import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';

@Module({
  imports: [HttpModule],
  providers: [CmsService],
  controllers: [CmsController],
  exports: [CmsService],
})
export class CmsModule {}
