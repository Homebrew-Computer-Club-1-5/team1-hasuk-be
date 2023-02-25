import { launchNewPage } from '../../commons/launchNewPage';
import { setBrowserConfigs } from '../../commons/setBrowserConfigs';
import { sortPostsByUntil } from './board';
import { getResults } from './post';
import { allPostsSelector } from './selectors';

interface IcrawlNamMeoungDormitory {
  crawlUntil: Date;
}

const boardUrl = 'http://www.nmhs.or.kr/boardlist.do?seqId=0000000286';

export async function crawlNamMeoungDormitory({ crawlUntil }) {
  const browser = await setBrowserConfigs();
  const page = await launchNewPage({ browser });

  await page.goto(boardUrl);

  const allPosts = await page.$$(allPostsSelector);

  const sortedPosts = await sortPostsByUntil({ posts: allPosts, crawlUntil });

  const results = await getResults({
    posts: sortedPosts,
  });
  console.log(results, 'ddd');
  return results as any;
}
