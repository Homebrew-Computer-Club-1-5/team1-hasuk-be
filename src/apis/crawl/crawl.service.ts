import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { crawl } from './functions/crawl';

// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { House } from "../db_entity_crud/house/entities/house.entity";
export const CRAWL_UPDATE_PERIOD = `*/${process.env.CRAWL_UPDATE_PERIOD} * * * * *`;

@Injectable()
export class CrawlService {
  @Cron(CRAWL_UPDATE_PERIOD, {
    name: 'crawl',
    timeZone: 'Asia/Seoul',
  }) // 주기 설정
  async handleCrawl() {
    console.log(`*/${process.env.CRAWL_UPDATE_PERIOD} * * * * *`);
    console.log('cron실행');
    // const result = await crawl(
    //   {
    //     latestBoardDate: 192878,
    //     isFirstCrawl: false,
    //     contactNumberRegExp: /\d{2,3}(-|\.|\s*)\d{3,4}(-|\.|\s*)\d{3,4}/gm,
    //   },
    //   { id: process.env.CRAWL_KOREAPAS_ID, pw: process.env.CRAWL_KOREAPAS_PW },
    // );
  }
}
