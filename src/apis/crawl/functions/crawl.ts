import firstCrawl from './firstCrawl';
import { login } from './login';
import { setBrowserConfigs } from './setBrowserConfigs';
import updateCrawl from './updateCrawl';

export interface IBoardCrawledData {
  boardId: number;
  boardDate: number;
  contactNumber: string;
  homeImgUrls: string[];
  otherInfo: string;
  house_category_id: number;
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
  latestBoardDate?: number;
  contactNumberRegExp: RegExp;
  boardUrl: string;
  house_category_id: number;
}

export async function crawl(
  {
    contactNumberRegExp,
    latestBoardDate,
    boardUrl,
    house_category_id,
  }: IcrawlConfig,
  { id, pw }: Iauth,
): Promise<IBoardCrawledData[]> {
  // 1. 브라우저 기본 셋팅
  const { page, browser } = await setBrowserConfigs();

  // 2. 홈페이지로 이동
  await page.goto('https://www.koreapas.com/bbs/main.php');

  // 3. 로그인
  await login(page, { id, pw });

  // 4. 게시판 페이지로 이동
  await page.goto(boardUrl);

  // 4. 크롤링 - 최근 crawlTerm 시간동안 올라온 게시물
  let boardCrawledDatas: IBoardCrawledData[] = [];
  boardCrawledDatas = await updateCrawl(
    page,
    latestBoardDate,
    contactNumberRegExp,
    house_category_id,
  );

  // 5. 브라우저 닫기
  await browser.close();
  return boardCrawledDatas;
}
