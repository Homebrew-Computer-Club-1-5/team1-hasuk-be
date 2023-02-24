import { launchNewPage } from '../commons/launchNewPage';
import { setBrowserConfigs } from '../commons/setBrowserConfigs';
import { extractPostUrls } from './board';
import { crawlPost, getCrawlPostResults } from './post';
import { allPostsSelector } from './selectors';

export interface IBoardCrawledData {
  boardDate: number;
  contactNumber: string;
  homeImgUrls: string[];
  otherInfo: string;
  house_category_id: number;
}

interface IcrawlConfig {
  crawlUntil: Date;
  boardUrl: string;
  house_category_id: number;
}

export async function crawlKoreaPas({
  crawlUntil,
  boardUrl,
  house_category_id,
}: IcrawlConfig): Promise<IBoardCrawledData[]> {
  const testDate = new Date(2023, 1, 20);
  const browser = await setBrowserConfigs();
  const page = await launchNewPage({ browser });

  await page.goto(boardUrl);

  const allPosts = await page.$$(allPostsSelector);

  const postUrls = await extractPostUrls({ posts: allPosts });

  const crawlResult = await getCrawlPostResults({
    postUrls,
    browser,
    crawlUntil: testDate,
    house_category_id,
  });

  await browser.close();
  return crawlResult;
}
