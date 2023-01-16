import * as puppeteer from 'puppeteer';
import firstCrawl from './firstCrawl';
import { login } from './login';
import { setBrowserConfigs } from './setBrowserConfigs';
import updateCrawl from './updateCrawl';

// crawl 주기 설정 (단위 주의)
const crawlTerm = 6; // 시간
// const firstCrawlPeriod_Day = 20; // 얘는 일 단위

// 전화번호 RegExp
const contactNumberRegExp = /\d{2,3}(-|\.|\s*)\d{3,4}(-|\.|\s*)\d{3,4}/gm;

// 로그인할 아이디 비번
const koreapas_id = 'gunpol';
const koreapas_pw = '159rjs497.';

// 크롤링 데이터 형식
// 크롤링 내용 : 전번, 사진 src , 게시글 내용, 게시물 번호, 게시물 날짜
export interface IBoardCrawledData {
  boardId: number;
  boardDate: number;
  contactNumber: string;
  homeImgUrls: string[];
  otherInfo: string;
}

export function toTimestamp(dateString: string): number {
  const date = new Date(dateString);
  return date.getTime();
}

export interface Iauth {
  id: string;
  pw: string;
}

interface IcrawlConfig {
  crawlPeriod_Day?: number;
  latestBoardDate?: number;
  isFirstCrawl: boolean;
  contactNumberRegExp: RegExp;
  boardUrl: string;
}

export async function crawl(
  {
    crawlPeriod_Day,
    isFirstCrawl,
    contactNumberRegExp,
    latestBoardDate,
    boardUrl,
  }: IcrawlConfig,
  { id, pw }: Iauth,
): Promise<IBoardCrawledData[]> {
  // 1. 브라우저 기본 셋팅
  const { page, browser } = await setBrowserConfigs();

  // 2. 홈페이지로 이동
  await page.goto('https://www.koreapas.com/bbs/main.php');

  // 3. 로그인
  await login(page, { id: koreapas_id, pw: koreapas_pw });

  // 4. 게시판 페이지로 이동
  await page.goto(`${boardUrl}`);

  // 4. 크롤링 - 최근 crawlTerm 시간동안 올라온 게시물
  let boardCrawledDatas: IBoardCrawledData[] = [];
  if (isFirstCrawl) {
    boardCrawledDatas = await firstCrawl(
      page,
      crawlPeriod_Day,
      contactNumberRegExp,
    );
  } else if (!isFirstCrawl) {
    boardCrawledDatas = await updateCrawl(
      page,
      latestBoardDate,
      contactNumberRegExp,
    );
  }
  console.log('crawledDatas : ', boardCrawledDatas);

  // 5. 브라우저 닫기
  await browser.close();
  return boardCrawledDatas;
}
