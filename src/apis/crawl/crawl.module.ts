import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlResolver } from './crawl.resolver';
import { CrawlService } from './crawl.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [CrawlResolver, CrawlService],
})
export class CrawlModule {}
