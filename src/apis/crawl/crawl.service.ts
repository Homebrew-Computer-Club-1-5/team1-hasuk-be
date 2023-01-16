import { Injectable, NestMiddleware } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { crawl } from './functions/crawl';
import { HouseService } from '../house/house.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    
  ) {}


  async findLatestBoardDate() {
    console.log('db에서 최신게시물날짜 조회중');
    
    let result : number;
    await this.dataSource.query('SELECT MAX(board_date) as result FROM tb_house ').then((prom)=>{
      result =  prom[0].result;
    });
    return result;
  }

  async mangeDeprecatedCrawledData() {
    console.log('mangeDeprecatedCrawledData');
    
    //2주이전 데이터는 has_empty = 0으로 바꿈
    await this.dataSource.query('UPDATE tb_house SET has_empty = 0 WHERE is_crolled = 1 and board_date < ? - 2*7*24*60*60*1000 ', [Date.now()])
    
    console.log('2주이전 데이터 갱신 완료');
    
    return;
  }

  async updateDB(crolledList) {
    console.log('크롤링 데이터로 db 업데이트');
    
    for(let i = 0; i<crolledList.length; i++)
    {
      const boardId = crolledList[i].boardId;
      const boardDate = crolledList[i].boardDate;
      const contactNumber = crolledList[i].contactNumber;
      const homeImgUrls = crolledList[i].homeImgUrls;
      const otherInfo = crolledList[i].otherInfo;
      let house_id;
      let is_crolled;

      console.log("조회중인 전화번호 : "+ contactNumber);
      //1. 전화번호 조회
      await this.dataSource.query('SELECT id, is_crolled FROM tb_house WHERE contact_number = ? ', [contactNumber]).then((prom)=>{
        console.log(prom);
        if(prom[0]){
          house_id = prom[0].id;
          is_crolled = prom[0].is_crolled;
        }
      });

      console.log('house_id : ' + house_id);
      console.log('is_crolled : ' + is_crolled);
      console.log('homeImgUrls : ' + homeImgUrls);
      
      //2. 전화번호가 있으면 update
      if(house_id){
        if(is_crolled){
          //3-1.크롤링 했던거면 boardDate, crolled, has_empty 갱신
          this.dataSource.query('UPDATE tb_house SET has_empty = 1, board_date = ? WHERE id = ? and is_crolled = 1 ', [boardDate, house_id]);
        }else{
          //3-2.크롤링 했던게 아니면 boardDate, other_info, imgs, isColled , (has_empty)
          this.dataSource.query('UPDATE tb_house SET house_other_info = ?, has_empty = 1, is_crolled = 1, board_date = ? WHERE id = ? and is_crolled != 1 ', [otherInfo, boardDate, house_id]);
          this.dataSource.query('DELETE FROM tb_house_img WHERE house_id = ? ', [house_id]);
          
          //이미지들 삽입
          for(let j = 0; j<homeImgUrls.length; j++)
          {
            this.dataSource.query('INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ', [homeImgUrls[j], house_id]);
            console.log('homeImgUrls : ' + homeImgUrls[j]);
          }
        }
        
      }else{
        //3. 전화번호가 없으면 insert
        await this.dataSource.query('INSERT INTO tb_house (house_other_info, has_empty, cost_id, house_location_id, house_category_id, region_id, is_crolled, contact_number, gender, board_date) VALUES (?, 1, null, null, null, null, 1, ?, null, ?) ', [otherInfo, contactNumber, boardDate]);
        await this.dataSource.query('SELECT id FROM tb_house WHERE contact_number = ? ', contactNumber).then((prom)=>{
          console.log(prom);
          if(prom[0]){
            house_id = prom[0].id;
          }
        });
        //이미지들 삽입
        for(let j = 0; j<homeImgUrls.length; j++)
        {
          this.dataSource.query('INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ', [homeImgUrls[j], house_id]);
          console.log('homeImgUrls : ' + homeImgUrls[j]);
        }
        
      }
  
    }
    return;
  }

  @Cron(`*/55 * * * * *`, {
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
        boardUrl: boardUrls.hasuk,
      },
      { id: process.env.CRAWL_KOREAPAS_ID, pw: process.env.CRAWL_KOREAPAS_PW },
    );

    // const result = [
    //   //새로운번호
    //   {
    //   boardId: 192687,
    //   boardDate: 1673283725000,
    //   contactNumber: '01064214239',
    //   homeImgUrls: [
    //     'https://img.koreapas.com/i/2de0e03/resize',
    //     'https://img.koreapas.com/i/52e300b/resize',
    //     'https://img.koreapas.com/i/bb5840f/resize'
    //   ],
    //   house_category_id : 1,
    //   otherInfo: '\n' +
    //     '  안녕하세요, 하숙집을 구하시는 여학생들에게 좋은 방을 소개시켜 드립니다.\n' +
    //     '위치는 정대후문에서 2~3분 거리의 개운사 승가마트 근처에 위치해 있고요.\n' +
    //     '일반 단독주택형 하숙집이라 층마다 소수 인원이 생활하고 있어 북적이지 않아 좋습니다.\n' +
    //     '햇빛도 잘 들어오는 방이라 따뜻하고 밝은 분위기에서 쾌적하게 지내실 수 있으세요.\n' +
    //     '인터넷도 KT 1기가인터넷으로 유선 사용시 최대 1기가의 빠른 속도와 무선 와이파이가 지원되므로 노트북이나 스마트폰으로 인터넷 사용하기 편리해요.\n' +
    //     '그 외에 냉장고, 세탁기, 에어컨, 전자렌지 등은 기본이지요.\n' +
    //     '식사는 가정식 백반으로 평일 조식과 석식이 제공됩니다.\n' +
    //     '\n' +
    //     '자세한 문의는 전화로 주세요~ :)\n' +
    //     '\n' +
    //     '* 각방 에어컨, 냉장고 완비, 각층 전자레인지 제공\n'
        
    // },
    // //번호는 있고 crawling되어있음 house_id : 1 원래 url12, url13
    // {
    //   boardId: 192688,
    //   boardDate: 1673200725000,
    //   contactNumber: '01052756689',
    //   homeImgUrls: [
    //     'https://img.koreapas.com/i/2de0e03/resize',
    //     'https://img.koreapas.com/i/52e300b/resize'
    //   ],
    //   house_category_id : 1,
    //   otherInfo: '\n other info~~~ \n'
    // },
    // //번호는 있고 crawling안되어있음 house_id : 3 원래 url1, url11
    // {
    //   boardId: 192688,
    //   boardDate: 1673200725000,
    //   contactNumber: '2352361',
    //   homeImgUrls: [
    //     'https://img.koreapas.com/i/2de0e03/resize',
    //     'https://img.koreapas.com/i/52e300b/resize'
    //   ],
    //   house_category_id : 1,
    //   otherInfo: '\n other info~~~ \n'
    // }
    // ];


    // 4. DB 업데이트
    await this.updateDB(result);
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

    for(let i = 0; i<result.length; i++)
    {
      const boardId = result[i].boardId;
      const boardDate = result[i].boardDate;
      const contactNumber = result[i].contactNumber;
      const homeImgUrls = result[i].homeImgUrls;
      const otherInfo = result[i].otherInfo;
      let house_id;

      console.log("조회중인 전화번호 : "+ contactNumber);
      //1. 전화번호 조회
      await this.dataSource.query('SELECT id, FROM tb_house WHERE contact_number = ? ', [contactNumber]).then((prom)=>{
        console.log(prom);
        if(prom[0]){
          house_id = prom[0].id;
        }
      });

      console.log('house_id : ' + house_id);
  
      //2. 전화번호가 있으면 update
      if(house_id){
        
          //크롤링 했던게 아니므로 boardDate, other_info, imgs, isColled , (has_empty)
          this.dataSource.query('UPDATE tb_house SET house_other_info = ?, has_empty = 1, is_crolled = 1, board_date = ? WHERE id = ? and is_crolled != 1 ', [otherInfo, boardDate, house_id]);
          this.dataSource.query('DELETE FROM tb_house_img WHERE house_id = ? ', [house_id]);
          //이미지들 삽입
          for(let j = 0; j<homeImgUrls.length; j++)
          {
            this.dataSource.query('INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ', [homeImgUrls[j], house_id]);
          }
        
      }else{
        //3. 전화번호가 없으면 insert
        await this.dataSource.query('INSERT INTO tb_house (house_other_info, has_empty, cost_id, house_location_id, house_category_id, region_id, is_crolled, contact_number, gender, board_date) VALUES (?, 1, null, null, null, null, 1, ?, null, ?) ', [otherInfo, contactNumber, boardDate]);
        await this.dataSource.query('SELECT id FROM tb_house WHERE contact_number = ? ', [contactNumber]).then((prom)=>{
          console.log(prom);
          if(prom[0]){
            house_id = prom[0].id;
          }
        });
        //이미지들 삽입
        for(let j = 0; j<homeImgUrls.length; j++)
        {
          this.dataSource.query('INSERT INTO tb_house_img (img_url, house_id) VALUES (?, ?) ', [homeImgUrls[j], house_id]);
        }
        
      }
  
    }
  }
}
