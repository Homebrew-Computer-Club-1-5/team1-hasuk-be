import { launchNewPage } from '../../commons/launchNewPage';
import { setBrowserConfigs } from '../../commons/setBrowserConfigs';
import { getResults, sortPostsByUntil } from './board';
import { allPostsSelector } from './selectors';

const boardUrl =
  'http://www.gumigh.or.kr/gumigh/bbs_list.php?unsingcode1=1185858122&unsingcode2=1482852827&code=notice';

interface IcrawlKoreaUniversityDormitory {
  crawlUntil: Date;
}

export async function crawlGumiHakSukDormitory({
  crawlUntil,
}: IcrawlKoreaUniversityDormitory) {
  const browser = await setBrowserConfigs();
  const page = await launchNewPage({ browser });

  await page.goto(boardUrl);

  const allPosts = await page.$$(allPostsSelector);

  const sortedPosts = await sortPostsByUntil({ posts: allPosts, crawlUntil });

  const results = await getResults({
    posts: sortedPosts,
  });
  await browser.close();
  return results as any;
}
