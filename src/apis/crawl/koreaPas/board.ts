import { ElementHandle } from 'puppeteer';

interface IextractPostUrls {
  posts: ElementHandle<HTMLTableRowElement>[];
}
export async function extractPostUrls({ posts }: IextractPostUrls) {
  const postUrls: string[] = [];
  for (let i = 0; i < posts.length; i++) {
    const postHandleElement = posts[i];

    const postUrl = await postHandleElement.$eval('td:nth-child(4) > a',element => element.href)
    postUrls.push(postUrl);
  }
  return postUrls
}
