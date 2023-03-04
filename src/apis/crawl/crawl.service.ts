import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { crawlKoreaPas } from './koreaPas/crawl';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { createWriteStream } from 'fs';
import { Storage } from '@google-cloud/storage';
import { v1 } from 'uuid';
import { crawlKoreaUniversityDormitory } from './dormitory/crawl';
import { crawlGumiHakSukDormitory } from './dormitory/gumiHakSuk/crawl';
import { crawlNamMeoungDormitory } from './dormitory/namMeoung/crawl';
import { CalendarService } from '../calendar/calendar.service';
import { Calendar } from 'src/db_entity/calendar/entities/calendar.entity';
const boardInfos = [
  {
    board_name: '일반',
    house_category_id: 1,
    url: 'https://www.koreapas.com/bbs/zboard.php?category=1&id=house&page=1&page_num=30&sn=off&ss=on&sc=on&keyword=&tagkeyword=&select_arrange=headnum&desc=asc',
  },
  {
    board_name: '하숙',
    house_category_id: 2,
    url: 'https://www.koreapas.com/bbs/zboard.php?category=2&id=house&page=1&page_num=30&sn=off&ss=on&sc=on&keyword=&tagkeyword=&select_arrange=headnum&desc=asc',
  },
  {
    board_name: '자취/원룸',
    house_category_id: 3,
    url: 'https://www.koreapas.com/bbs/zboard.php?category=3&id=house&page=1&page_num=30&sn=off&ss=on&sc=on&keyword=&tagkeyword=&select_arrange=headnum&desc=asc',
  },
  {
    board_name: '고시원',
    house_category_id: 4,
    url: 'https://www.koreapas.com/bbs/zboard.php?category=4&id=house&page=1&page_num=30&sn=off&ss=on&sc=on&keyword=&tagkeyword=&select_arrange=headnum&desc=asc',
  },
  {
    board_name: '기타',
    house_category_id: 5,
    url: 'https://www.koreapas.com/bbs/zboard.php?category=7&id=house&page=1&page_num=30&sn=off&ss=on&sc=on&keyword=&tagkeyword=&select_arrange=headnum&desc=asc',
  },
];

@Injectable()
export class CrawlService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Calendar)
    private readonly calendar_repository: Repository<Calendar>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findLatestBoardDateByCategoryId(category_id) {
    console.log('db에서 최신게시물날짜 조회중');

    let result: number;
    await this.dataSource
      .query(
        'SELECT MAX(board_date) as result FROM tb_house WHERE house_category_id = ? ',
        [category_id],
      )
      .then((prom) => {
        result = prom[0].result;
      });
    return result;
  }

  async mangeDeprecatedCrawledData() {
    console.log('mangeDeprecatedCrawledData');

    //2주이전 데이터는 has_empty = 0으로 바꿈
    await this.dataSource.query(
      'UPDATE tb_house SET has_empty = 0 WHERE is_crolled = 1 and board_date < ? - 2*7*24*60*60*1000 ',
      [Date.now()],
    );

    console.log('2주이전 크롤링 데이터 삭제 완료');

    return;
  }

  async updateDB(crolledList, category_id) {
    console.log('크롤링 데이터로 db 업데이트');

    for (let i = 0; i < crolledList.length; i++) {
      const boardId = crolledList[i].boardId;
      const boardDate = crolledList[i].boardDate;
      const contactNumber = crolledList[i].contactNumber;
      const homeImgUrls = crolledList[i].homeImgUrls;
      const otherInfo = crolledList[i].otherInfo;
      let house_id;
      let is_crolled;

      console.log('조회중인 전화번호 : ' + contactNumber);
      //1. 전화번호 조회
      await this.dataSource
        .query('SELECT id, is_crolled FROM tb_house WHERE contact_number = ?', [
          contactNumber,
        ])
        .then((prom) => {
          console.log(prom);
          if (prom[0]) {
            house_id = prom[0].id;
            is_crolled = prom[0].is_crolled;
          }
        });

      console.log('house_id : ' + house_id);
      console.log('is_crolled : ' + is_crolled);
      console.log('homeImgUrls : ' + homeImgUrls);

      //2. 전화번호가 있으면 update
      if (house_id) {
        if (is_crolled) {
          //3-1.크롤링 했던거면 boardDate, crolled, has_empty 갱신
          this.dataSource.query(
            'UPDATE tb_house SET has_empty = 1, board_date = ? WHERE id = ? and is_crolled = 1 ',
            [boardDate, house_id],
          );
        } else {
          //3-2.크롤링 했던게 아니면(사용자가 올린게시물이면) 가만히...
        }
      } else {
        //3. 전화번호가 없으면 insert
        await this.dataSource.query(
          'INSERT INTO tb_house (house_other_info, has_empty, cost_id, house_location_id, house_category_id, region_id, is_crolled, contact_number, gender, board_date) VALUES (?, 1, null, null, ?, null, 1, ?, null, ?) ',
          [otherInfo, category_id, contactNumber, boardDate],
        );
        await this.dataSource
          .query(
            'SELECT id FROM tb_house WHERE contact_number = ? ',
            contactNumber,
          )
          .then((prom) => {
            console.log(prom);
            if (prom[0]) {
              house_id = prom[0].id;
            }
          });

        //이미지들 삽입

        const storage = new Storage({
          projectId: 'board-373207',
          keyFilename: 'board-373207-a02f17b5865d.json',
        }).bucket(process.env.GOOGLE_IMAGE_STORAGE);

        const results = await Promise.all(
          homeImgUrls.map((el) => {
            const uuid = v1();
            new Promise(async (resolve, reject) => {
              try {
                const response = await this.httpService.axiosRef({
                  url: el,
                  method: 'GET',
                  responseType: 'stream',
                });
                //db에 이미지url삽입
                this.dataSource.query(
                  'INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ',
                  [
                    'https://storage.googleapis.com/' +
                      process.env.GOOGLE_IMAGE_STORAGE +
                      '/' +
                      uuid +
                      '.jpg',
                    house_id,
                  ],
                );

                //storage에 저장
                response.data
                  .pipe(storage.file(uuid + '.jpg').createWriteStream())
                  .on('finish', () => {
                    resolve(`${process.env.GOOGLE_IMAGE_STORAGE}/${uuid}.jpg`);
                  })
                  .on('error', () => {
                    reject();
                  });

                //db에 이미지url삽입
                this.dataSource.query(
                  'INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ',
                  [
                    'https://storage.googleapis.com/' +
                      process.env.GOOGLE_IMAGE_STORAGE +
                      '/' +
                      uuid +
                      '.jpg',
                    house_id,
                  ],
                );

                //storage에 저장
                response.data
                  .pipe(storage.file(uuid + '.jpg').createWriteStream())
                  .on('finish', () => {
                    resolve(`${process.env.GOOGLE_IMAGE_STORAGE}/${uuid}.jpg`);
                  })
                  .on('error', () => {
                    reject();
                  });
              } catch (error) {
                console.log(error);
              }
            });
          }),
        );
      }
    }
    return;
  }

  // @Cron(`*/40 * * * * *`, {
  // @Cron(`0 */1 * * * * *`, {
  // @Cron(`0 0 0,3,6,9,12,15,18,21 * * *`, {
  //   // @Cron(`0 */2 * * * *`, {
  //   name: 'crawl',
  //   timeZone: 'Asia/Seoul',
  // })
  async crawlKoreaPas() {
    console.log(
      '====================== KoreaPas Crawl init ===========================',
    );
    await this.mangeDeprecatedCrawledData();

    let result = [];
    for await (const boardInfo of boardInfos) {
      console.log(`${boardInfo.board_name} 게시판 latestBoardDate 조회 `);
      // 1. latestBoardDate DB에서 조회
      const latestBoardDate = await this.findLatestBoardDateByCategoryId(
        boardInfo.house_category_id,
      );

      const crawlUntil = new Date(latestBoardDate);

      const boardResult = await crawlKoreaPas({
        crawlUntil,
        boardUrl: boardInfo.url,
        house_category_id: boardInfo.house_category_id,
      });
      result.push(boardResult);
      await this.updateDB(boardResult, boardInfo.house_category_id);
    }

    console.log(
      '====================== KoreaPas Crawl complete ===========================',
    );
    return 'crawl complete';
  }

  async crawlKoreaUniversityDormitory({ untilYear, untilMonth, untilDate }) {
    console.log(
      '====================== KoreaUniversityDormitory Crawl init ===========================',
    );
    const result = await crawlKoreaUniversityDormitory({
      crawlUntil: new Date(untilYear, untilMonth - 1, untilDate),
    });
    console.log(
      '====================== KoreaUniversityDormitory Crawl Complete ===========================',
    );
    return result;
  }
  //
  async crawlNamMeoungDormitory({ untilYear, untilMonth, untilDate }) {
    console.log(
      '====================== NamMeoungDormitory Crawl init ===========================',
    );
    const result = await crawlNamMeoungDormitory({
      crawlUntil: new Date(untilYear, untilMonth - 1, untilDate),
    });
    console.log(
      '====================== NamMeoungDormitory Crawl Complete ===========================',
    );
    return result;
  }

  async crawlGumiHakSukDormitory({ untilYear, untilMonth, untilDate }) {
    console.log(
      '====================== GumiHakSukDormitory Crawl init ===========================',
    );
    const result = await crawlGumiHakSukDormitory({
      crawlUntil: new Date(untilYear, untilMonth - 1, untilDate),
    });
    console.log(
      '====================== GumiHakSukDormitory Crawl Complete ===========================',
    );
    return result;
  }
  //

  //

  async calendarUpdateDB(result, dormitory_id){
    
    for(let i = 0; i< result.length; i++){
        const postTitle = result[i].postTitle;
        const postDate = result[i].postDate;
        const postLink = result[i].postLink;

        const hasPost = await this.calendar_repository.find({where: {post_link:postLink}});

        if(hasPost.length == 0){
          await this.calendar_repository.save({
              dormitory: {id: dormitory_id},
              post_date:postDate,
              post_link:postLink,
              post_title: postTitle,
          } )
        }
    }
  }

  async crawlAllDormitory({ untilYear, untilMonth, untilDate }) {
    this.calendarUpdateDB(
      await this.crawlKoreaUniversityDormitory({
        untilYear,
        untilMonth,
        untilDate,
      }),
      2,
    );
    this.calendarUpdateDB(
      await this.crawlNamMeoungDormitory({ untilYear, untilMonth, untilDate }),
      4,
    );
    this.calendarUpdateDB(
      await this.crawlGumiHakSukDormitory({ untilYear, untilMonth, untilDate }),
      3,
    );
    return 'complete!!';
  }
}
