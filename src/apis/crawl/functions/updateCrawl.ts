import * as puppeteer from 'puppeteer';
import { IBoardCrawledData } from './crawl';
import { toTimestamp } from './crawl';

export default async function updateCrawl(
  page: puppeteer.Page,
  latestBoardDate: number,
  contactNumberRegExp: RegExp,
) {
  // 1) 크롤링 준비
  // 결과물
  const boardCrawledDatas = [];
  // 시간 판단 하는 불리언
  let isOld = false;

  // 2) 크롤링 (크롤링동안 게시물 올라오는건 고려 X, 대신 사람들 안올라오는 시간에 크롤링 ㄱㄱ)
  outer: while (!isOld) {
    inner: for (let i = 0; i < 30; i++) {
      console.log('페이지 접속중');
      await page.waitForSelector(
        `#revolution_main_table > tbody > tr:nth-child(${
          2 * i + 3
        }) > td:nth-child(4) > a`,
      );
      const response = await Promise.all([
        page.waitForNavigation(),
        page.click(
          `#revolution_main_table > tbody > tr:nth-child(${
            2 * i + 3
          }) > td:nth-child(4) > a`,
        ),
      ]);
      console.log('접속완료');

      // 정보들 크롤링 해서 객체에 담기
      // boardDate, boardId
      let boardDateSelector = 4;
      let boardIdSelector = 5;

      // "~시간 전" 이 없는 게시물일경우 +1씩
      // 검증
      await page.waitForSelector(
        'body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(4)',
      );
      const isRecentText = await page.$eval(
        'body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(4)',
        (element) => element.textContent,
      );
      if (isRecentText === '하숙 | ') {
        boardDateSelector++;
        boardIdSelector++;
      }

      // boardDate 크롤링 + 정제
      // 크롤링
      await page.waitForSelector(
        `body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(${boardDateSelector})`,
      );
      let boardDate = await page.$eval(
        `body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(${boardDateSelector})`,
        (element) => element.textContent as string,
      );
      // 앞부분 정제
      boardDate = boardDate.replace('등록일 : ', '');
      // 뒷부분 정제
      // i. ~시간 전 부분 있으면 삭제
      if (boardDate.includes('전')) {
        const openBracketIndex = boardDate.indexOf('(') - 1;
        boardDate = boardDate.slice(0, openBracketIndex);
        // ii. 없으면 공백 삭제
      } else {
        const lastEmptyIndex = boardDate.lastIndexOf(' ');
        boardDate = boardDate.slice(0, boardDate.lastIndexOf(' '));
      }
      // '2023-01-10 12:38:52' 형식으로 정제 완료 후 timestamp 형식으로 전환
      boardDate = toTimestamp(boardDate) as any;
      if (parseInt(boardDate) <= latestBoardDate) {
        console.log(
          '================================Crawling Complete================================',
        );
        isOld = true;
        break outer;
      }
      // boardId 크롤링 + 정제
      // 크롤링
      await page.waitForSelector(
        `body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(${boardIdSelector})`,
      );
      let boardId = await page.$eval(
        `body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(${boardIdSelector})`,
        (element) => element.textContent as string,
      );
      // ' | 글번호 : 192704 | 132179'
      // 처음으로 숫자가 나오는 인덱스 찾고 => 거기서부터|나오기 앞앞 까지 크롤링
      boardId = boardId.slice(3);
      const boardIdArray = boardId.split('');
      const firstNumberIndex = boardIdArray.findIndex((each) => parseInt(each));
      const barIndex = boardId.indexOf('|') - 1;
      boardId = boardId.slice(firstNumberIndex, barIndex);
      // 게시글 - otherInfo
      await page.waitForSelector(
        '#bonmoon > tbody > tr:nth-child(1) > td > div',
      );
      let otherInfo = await page.$eval(
        '#bonmoon > tbody > tr:nth-child(1) > td > div',
        (element) => element.textContent as string,
      );
      // let otherInfo = await page.evaluate((selector) => {
      //   let element = document.querySelector(selector);
      //   // return Buffer.from(element.textContent, 'utf8').toString();
      //   return element.textContent.normalize();
      // }, '#bonmoon > tbody > tr:nth-child(1) > td > div');

      // 전화번호 - contactNumber
      const contactNumberMatchResult = otherInfo?.match(contactNumberRegExp);
      let contactNumber: string;
      if (contactNumberMatchResult !== null) {
        contactNumber = (contactNumberMatchResult as any)[0];
        contactNumber = contactNumber.replace(/\D/gm, '');
      } else {
        contactNumber = '01012345678';
      }

      // 01012345678 형식으로 반환
      // 이미지 url - homeImgUrl
      // 이미지 최대 10장가져옴
      const homeImgUrls = await page.$$eval('img[id^=gifb_]', (elements) =>
        elements.map((element) => element.src),
      );
      // 객체에 담기
      const boardCrawledData: IBoardCrawledData = {
        boardId: parseInt(boardId),
        boardDate: parseInt(boardDate),
        contactNumber,
        homeImgUrls,
        otherInfo,
        house_category_id: 1,
      };
      console.log('boardId : ', boardCrawledData.boardId);
      boardCrawledDatas.push(boardCrawledData);

      // 페이지 빠져나오기
      // console.log('뒤로가기')
      await page.goBack();
    }

    //첫번째 페이지 여부 판단
    const isFirstPage = await page.evaluate(
      (selector) => document.querySelector(selector) !== null,
      'body > div > div:nth-child(7) > div > form > table:nth-child(14) > tbody > tr > td.nanum-g > span:nth-child(11) > a:nth-child(2)',
    );
    // 다음페이지 넘어가고, 로드될때까지 기다리기
    await Promise.all([
      page.waitForNavigation(),
      page.click(
        `body > div > div:nth-child(7) > div > form > table:nth-child(14) > tbody > tr > td.nanum-g > span:nth-child(${
          isFirstPage ? 11 : 12
        }) > a:nth-child(2)`,
      ),
    ]);
  }
  return boardCrawledDatas;
}
