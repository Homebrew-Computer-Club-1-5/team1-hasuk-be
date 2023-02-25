import { ElementHandle } from 'puppeteer';
import { IcrawlPostResult } from './types';
import { stringToDateObject } from './util';

interface IgetResults {
  posts: ElementHandle<HTMLTableRowElement>[];
}

export async function getResults({ posts }) {
  const result: IcrawlPostResult[] = [];
  for (let i = 0; i < posts.length; i++) {
    const postHandleElement = posts[i];
    const boardDateString = await postHandleElement.$eval(
      'td.date',
      (element) => element.textContent,
    );
    const postDate = stringToDateObject(boardDateString);

    const postTitle = await postHandleElement.$eval(
      'td.postTitle > a',
      (element) => element.textContent,
    );

    const postLink = await postHandleElement.$eval(
      'td.postTitle > a',
      (element) => element.href,
    );
    result.push({ postTitle, postDate, postLink });
  }
  return result;
}
