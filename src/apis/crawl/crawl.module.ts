import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlResolver } from './crawl.resolver';
import { CrawlService } from './crawl.service';
import {HttpModule} from '@nestjs/axios';
import { Calendar } from 'src/db_entity/calendar/entities/calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar]), HttpModule],
  providers: [CrawlResolver, CrawlService],
})
export class CrawlModule {}
