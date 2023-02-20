import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { crawl } from './functions/crawl';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { createWriteStream } from 'fs';
import { Storage } from '@google-cloud/storage';
import { v1 } from 'uuid';

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
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findLatestBoardDate(category_id) {
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

    console.log('2주이전 데이터 갱신 완료');

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
        }).bucket(process.env.STORAGE);

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
                      process.env.STORAGE +
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
                    resolve(`${process.env.STORAGE}/${uuid}.jpg`);
                  })
                  .on('error', () => {
                    reject();
                  });

                //db에 이미지url삽입
                this.dataSource.query(
                  'INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ',
                  [
                    'https://storage.googleapis.com/' +
                      process.env.STORAGE +
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
                    resolve(`${process.env.STORAGE}/${uuid}.jpg`);
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
  @Cron(`0 0 0,3,6,9,12,15,18,21 * * *`, {
    // @Cron(`0 */2 * * * *`, {
    name: 'crawl',
    timeZone: 'Asia/Seoul',
  })
  async crawl() {
    console.log(
      '====================== Crawl init ===========================',
    );
    // 1. deprecated crawled data 관리
    await this.mangeDeprecatedCrawledData();

    // 2. latest board date 찾기
    // const latestBoardDate = await this.findLatestBoardDate();

    for await (const boardInfo of boardInfos) {
      console.log(`${boardInfo.board_name} 게시판 latestBoardDate 조회 `);
      // 1. latestBoardDate DB에서 조회
      const latestBoardDate = await this.findLatestBoardDate(
        boardInfo.house_category_id,
      ); // 여기 인자로 house_category_id 들어가야함
      // const latestBoardDate = 1674117774000;
      const result = await crawl(
        {
          latestBoardDate: latestBoardDate,
          contactNumberRegExp: /\d{2,3}(-|\.|\s*)\d{3,4}(-|\.|\s*)\d{3,4}/gm,
          boardUrl: boardInfo.url,
          house_category_id: boardInfo.house_category_id,
        },
        {
          id: process.env.CRAWL_KOREAPAS_ID,
          pw: process.env.CRAWL_KOREAPAS_PW,
        },
      );
      console.log(result);
      // 4. DB 업데이트
      await this.updateDB(result, boardInfo.house_category_id);
    }

    console.log(
      '====================== Crawl complete ===========================',
    );
  }

  // 3번단계 - .map으로 DB UPDATE / INSERT 하면됨

  // for (let i = 0; i < result.length; i++) {
  //   const boardId = result[i].boardId;
  //   const boardDate = result[i].boardDate;
  //   const contactNumber = result[i].contactNumber;
  //   const homeImgUrls = result[i].homeImgUrls;
  //   const otherInfo = result[i].otherInfo;
  //   let house_id;

  //   console.log('조회중인 전화번호 : ' + contactNumber);
  //   //1. 전화번호 조회
  //   await this.dataSource
  //     .query('SELECT id, FROM tb_house WHERE contact_number = ? ', [
  //       contactNumber,
  //     ])
  //     .then((prom) => {
  //       console.log(prom);
  //       if (prom[0]) {
  //         house_id = prom[0].id;
  //       }
  //     });

  //   console.log('house_id : ' + house_id);

  //   //2. 전화번호가 있으면 update
  //   if (house_id) {
  //     //크롤링 했던게 아니므로 boardDate, other_info, imgs, isColled , (has_empty)
  //     this.dataSource.query(
  //       'UPDATE tb_house SET house_other_info = ?, has_empty = 1, is_crolled = 1, board_date = ? WHERE id = ? and is_crolled != 1 ',
  //       [otherInfo, boardDate, house_id],
  //     );
  //     this.dataSource.query('DELETE FROM tb_house_img WHERE house_id = ? ', [
  //       house_id,
  //     ]);
  //     //이미지들 삽입
  //     for (let j = 0; j < homeImgUrls.length; j++) {
  //       this.dataSource.query(
  //         'INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ',
  //         [homeImgUrls[j], house_id],
  //       );
  //     }
  //   } else {
  //     //3. 전화번호가 없으면 insert
  //     await this.dataSource.query(
  //       'INSERT INTO tb_house (house_other_info, has_empty, cost_id, house_location_id, house_category_id, region_id, is_crolled, contact_number, gender, board_date) VALUES (?, 1, null, null, null, null, 1, ?, null, ?) ',
  //       [otherInfo, contactNumber, boardDate],
  //     );
  //     await this.dataSource
  //       .query('SELECT id FROM tb_house WHERE contact_number = ? ', [
  //         contactNumber,
  //       ])
  //       .then((prom) => {
  //         console.log(prom);
  //         if (prom[0]) {
  //           house_id = prom[0].id;
  //         }
  //       });
  //     //이미지들 삽입
  //     for (let j = 0; j < homeImgUrls.length; j++) {
  //       this.dataSource.query(
  //         'INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ',
  //         [homeImgUrls[j], house_id],
  //       );
  //     }
  //   }
  // }
  // }
}
