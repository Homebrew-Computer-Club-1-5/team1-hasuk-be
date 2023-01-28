import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlResolver } from './crawl.resolver';
import { CrawlService } from './crawl.service';
import {HttpModule} from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([]), HttpModule],
  providers: [CrawlResolver, CrawlService],
})
export class CrawlModule {}
