import { ElementHandle } from 'puppeteer';
import { postDateSelector } from './selectors';

interface IsortPostsByUntil {
  posts: ElementHandle[];
  crawlUntil: Date;
}
export async function sortPostsByUntil({
  posts,
  crawlUntil,
}: IsortPostsByUntil) {
  const result: ElementHandle[] = [];
  for (let i = 0; i < posts.length; i++) {
    const postHandleElement = posts[i];
    const postDateString = await postHandleElement.$eval(
      postDateSelector,
      (element) => element.textContent,
    );
    const postDate = new Date(postDateString);
    if (postDate >= crawlUntil) result.push(postHandleElement);
  }
  return result;
}
