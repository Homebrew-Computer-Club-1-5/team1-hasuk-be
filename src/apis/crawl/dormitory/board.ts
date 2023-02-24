import { ElementHandle } from 'puppeteer';
import { stringToDateObject } from './util';

interface IsortPostsByUntil {
  allPosts: ElementHandle<HTMLTableRowElement>[];
  crawlUntil: Date;
}
export async function sortPostsByUntil({
  allPosts,
  crawlUntil,
}: IsortPostsByUntil) {
  const result: ElementHandle<HTMLTableRowElement>[] = [];
  for (let i = 0; i < allPosts.length; i++) {
    const postHandleElement = allPosts[i];
    const boardDateString = await postHandleElement.$eval(
      'td.date',
      (element) => element.textContent,
    );
    const boardDate = stringToDateObject(boardDateString);
    if (boardDate >= crawlUntil) result.push(postHandleElement);
  }
  return result;
}
