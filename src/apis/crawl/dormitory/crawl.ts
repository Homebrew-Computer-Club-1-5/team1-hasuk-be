import { setBrowserConfigs } from '../commons/setBrowserConfigs';
import { getResults } from './post';
import { sortPostsByUntil } from './board';
import { allPostsSelector } from './selectors';
import { launchNewPage } from '../commons/launchNewPage';

const boardUrl = 'https://dorm.korea.ac.kr/front/board/1/post';

interface IcrawlKoreaUniversityDormitory {
  crawlUntil: Date;
}

export async function crawlKoreaUniversityDormitory({
  crawlUntil,
}: IcrawlKoreaUniversityDormitory) {
  const browser = await setBrowserConfigs();
  const page = await launchNewPage({ browser });

  await page.goto(boardUrl);

  const allPosts = await page.$$(allPostsSelector);

  const sortedPosts = await sortPostsByUntil({ allPosts, crawlUntil });

  const results = await getResults({
    posts: sortedPosts,
  });
  await browser.close();
  return results as any;
}
