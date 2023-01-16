import { Injectable, NestMiddleware } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { crawl } from './functions/crawl';
import { HouseService } from '../house/house.service';

// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { House } from "../db_entity_crud/house/entities/house.entity";

const boardUrls = {
  hasuk:
    'https://www.koreapas.com/bbs/zboard.php?category=2&id=house&page=1&page_num=30&sn=off&ss=on&sc=on&keyword=&tagkeyword=&select_arrange=headnum&desc=asc',
  gosiwon:
    'https://www.koreapas.com/bbs/zboard.php?category=4&id=house&page=1&page_num=30&sn=off&ss=on&sc=on&keyword=&tagkeyword=&select_arrange=headnum&desc=asc',
};

@Injectable()
export class CrawlService {
  async findLatestBoardDate() {
    console.log('db조회중');
    return 1673748706000;
  }

  async mangeDeprecatedCrawledData() {
    console.log('mangeDeprecatedCrawledData');
    // 아까 말한 작업
    return;
  }

  async updateDB() {
    console.log('크롤링 데이터로 db 업데이트');
    return;
  }

  @Cron(`*/20 * * * * *`, {
    // @Cron(`0 0 0,3,6,9,12,15,18,21 * * *`, {
    name: 'crawl',
    timeZone: 'Asia/Seoul',
  })
  async updateCrawl() {
    console.log(
      '====================== updateCrawl init ===========================',
    );
    // 1. deprecated crawled data 관리
    await this.mangeDeprecatedCrawledData();

    // 2. latest board date 찾기
    const latestBoardDate = await this.findLatestBoardDate();

    // 3. 크롤링 ㄱㄱ
    const result = await crawl(
      {
        latestBoardDate,
        isFirstCrawl: false,
        contactNumberRegExp: /\d{2,3}(-|\.|\s*)\d{3,4}(-|\.|\s*)\d{3,4}/gm,
        boardUrl: boardUrls.gosiwon,
      },
      { id: process.env.CRAWL_KOREAPAS_ID, pw: process.env.CRAWL_KOREAPAS_PW },
    );

    // 4. DB 업데이트
    await this.updateDB();
    console.log(
      '====================== updateCrawl complete ===========================',
    );
  }

  async firstCrawl() {
    console.log('firstCrawl 실행');
    const result = await crawl(
      {
        crawlPeriod_Day: 14,
        isFirstCrawl: true,
        contactNumberRegExp: /\d{2,3}(-|\.|\s*)\d{3,4}(-|\.|\s*)\d{3,4}/gm,
        boardUrl: boardUrls.gosiwon,
      },
      { id: process.env.CRAWL_KOREAPAS_ID, pw: process.env.CRAWL_KOREAPAS_PW },
    );
    // 3번단계 - .map으로 DB UPDATE / INSERT 하면됨
  }
}
