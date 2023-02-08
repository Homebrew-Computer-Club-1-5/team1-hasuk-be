import * as puppeteer from 'puppeteer';
import { IBoardCrawledData } from './crawl';
import { toTimestamp } from './crawl';

export default async function updateCrawl(
  page: puppeteer.Page,
  latestBoardDate: number,
  contactNumberRegExp: RegExp,
  house_category_id: number,
) {
  // 1) 크롤링 준비
  // 결과물
  const boardCrawledDatas = [];
  // 시간 판단 하는 불리언
  let isOld = false;

  // 2) 크롤링 (크롤링동안 게시물 올라오는건 고려 X, 대신 사람들 안올라오는 시간에 크롤링 ㄱㄱ)
  outer: while (!isOld) {
    inner: for (let i = 0; i < 30; i++) {
      // console.log('페이지 접속중');
      let selectorAppeared = false;

      while (!selectorAppeared) {
        try {
          await page.waitForSelector(
            `#revolution_main_table > tbody > tr:nth-child(${
              2 * i + 3
            }) > td:nth-child(4) > a`,
          );
          selectorAppeared = true;
        } catch (error) {
          if (
            error.message.includes('timeout') ||
            error.message.includes('Waiting')
          ) {
            console.log('Timeout error, re-trying...');
            page.reload({ waitUntil: 'domcontentloaded' });
          } else {
            console.log(error.message);
            throw error;
          }
        }
      }
      selectorAppeared = false;
      const isAnnouncement = await page.evaluate(
        (selector) => document.querySelector(selector) !== null,
        `#revolution_main_table > tbody > tr:nth-child(${
          2 * i + 3
        }) >td:nth-child(1)>span`,
      );
      if (!isAnnouncement) {
        ///
        let navigationCompleted = false;

        while (!navigationCompleted) {
          try {
            const response = await Promise.all([
              page.waitForNavigation(),
              page.click(
                `#revolution_main_table > tbody > tr:nth-child(${
                  2 * i + 3
                }) > td:nth-child(4) > a`,
              ),
            ]);
            navigationCompleted = true;
          } catch (error) {
            if (
              error.message.includes('timeout') ||
              error.message.includes('Navigation')
            ) {
              console.log('Timeout error, re-trying...');
              page.reload({ waitUntil: 'domcontentloaded' });
            } else {
              console.log(error.message);
              throw error;
            }
          }
        }
        ///

        // 정보들 크롤링 해서 객체에 담기
        // boardDate, boardId
        let boardDateSelector = 4;
        let boardIdSelector = 5;

        // "~시간 전" 이 없는 게시물일경우 +1씩
        // 검증
        while (!selectorAppeared) {
          try {
            await page.waitForSelector(
              'body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(4)',
            );

            selectorAppeared = true;
          } catch (error) {
            if (
              error.message.includes('timeout') ||
              error.message.includes('Waiting')
            ) {
              console.log('Timeout error, re-trying...');
              page.reload({ waitUntil: 'domcontentloaded' });
            } else {
              console.log(error.message);
              throw error;
            }
          }
        }
        selectorAppeared = false;

        const isRecentText = await page.$eval(
          'body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(4)',
          (element) => element.textContent,
        );
        if ((isRecentText as any).length <= 10) {
          // innerText가 category_name 일경우
          boardDateSelector++;
          boardIdSelector++;
        }

        // boardDate 크롤링 + 정제
        // 크롤링
        while (!selectorAppeared) {
          try {
            await page.waitForSelector(
              `body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(${boardDateSelector})`,
            );

            selectorAppeared = true;
          } catch (error) {
            if (
              error.message.includes('timeout') ||
              error.message.includes('Waiting')
            ) {
              console.log('Timeout error, re-trying...');
              page.reload({ waitUntil: 'domcontentloaded' });
            } else {
              console.log(error.message);
              throw error;
            }
          }
        }
        selectorAppeared = false;
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
          console.log(parseInt(boardDate), '<=', latestBoardDate);
          console.log(
            '================================ 게시판 크롤링 완료 ================================',
          );
          isOld = true;
          break outer;
        }
        // boardId 크롤링 + 정제
        // 크롤링
        while (!selectorAppeared) {
          try {
            await page.waitForSelector(
              `body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(${boardIdSelector})`,
            );

            selectorAppeared = true;
          } catch (error) {
            if (
              error.message.includes('timeout') ||
              error.message.includes('Waiting')
            ) {
              console.log('Timeout error, re-trying...');
              page.reload({ waitUntil: 'domcontentloaded' });
            } else {
              console.log(error.message);
              throw error;
            }
          }
        }
        selectorAppeared = false;
        let boardId = await page.$eval(
          `body > div > div:nth-child(7) > div > table:nth-child(13) > tbody > tr > td:nth-child(2) > span:nth-child(${boardIdSelector})`,
          (element) => element.textContent as string,
        );
        // ' | 글번호 : 192704 | 132179'
        // 처음으로 숫자가 나오는 인덱스 찾고 => 거기서부터|나오기 앞앞 까지 크롤링
        boardId = boardId.slice(3);
        const boardIdArray = boardId.split('');
        const firstNumberIndex = boardIdArray.findIndex((each) =>
          parseInt(each),
        );
        const barIndex = boardId.indexOf('|') - 1;
        boardId = boardId.slice(firstNumberIndex, barIndex);
        // 게시글 - otherInfo
        while (!selectorAppeared) {
          try {
            await page.waitForSelector(
              '#bonmoon > tbody > tr:nth-child(1) > td > div',
            );

            selectorAppeared = true;
          } catch (error) {
            if (
              error.message.includes('timeout') ||
              error.message.includes('Waiting')
            ) {
              console.log('Timeout error, re-trying...');
              page.reload({ waitUntil: 'domcontentloaded' });
            } else {
              console.log(error.message);

              throw error;
            }
          }
        }
        selectorAppeared = false;
        let otherInfo = await page.$eval(
          '#bonmoon > tbody > tr:nth-child(1) > td > div',
          (element) => element.textContent as string,
        );
        // 출처삭제
        const refIndex = otherInfo.indexOf('출처 : 고려대학교 고파스');
        otherInfo = otherInfo.substring(0, refIndex);

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
          house_category_id,
        };
        console.log('boardId : ', boardCrawledData.boardId);
        boardCrawledDatas.push(boardCrawledData);

        // 페이지 빠져나오기
        // console.log('뒤로가기')
        await page.goBack();
      }
    }

    //첫번째 페이지 여부 판단
    const isFirstPage = await page.evaluate(
      (selector) => document.querySelector(selector) !== null,
      'body > div > div:nth-child(7) > div > form > table:nth-child(14) > tbody > tr > td.nanum-g > span:nth-child(11) > a:nth-child(2)',
    );
    // 다음페이지 넘어가고, 로드될때까지 기다리기

    let navigationCompleted = false;

    while (!navigationCompleted) {
      try {
        await Promise.all([
          page.waitForNavigation(),
          page.click(
            `body > div > div:nth-child(7) > div > form > table:nth-child(14) > tbody > tr > td.nanum-g > span:nth-child(${
              isFirstPage ? 11 : 12
            }) > a:nth-child(2)`,
          ),
        ]);
        navigationCompleted = true;
      } catch (error) {
        if (
          error.message.includes('timeout') ||
          error.message.includes('Navigation')
        ) {
          console.log('Timeout error, re-trying...');
          page.reload({ waitUntil: 'domcontentloaded' });
        } else {
          console.log(error.message);
          throw error;
        }
      }
    }
  }
  return boardCrawledDatas;
}
