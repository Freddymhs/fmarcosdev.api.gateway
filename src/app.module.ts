import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CmsModule } from './cms/cms.module';

@Module({
  imports: [CmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
