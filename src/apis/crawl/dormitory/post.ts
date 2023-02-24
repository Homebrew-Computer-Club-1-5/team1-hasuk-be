import { ElementHandle } from 'puppeteer';
import { stringToDateObject } from './util';

interface IgetResults {
  posts: ElementHandle<HTMLTableRowElement>[];
}

interface Iresult {
  title: string;
  boardDate: Date;
  postLink: string;
}
export async function getResults({ posts }) {
  const result: Iresult[] = [];
  for (let i = 0; i < posts.length; i++) {
    const postHandleElement = posts[i];
    const boardDateString = await postHandleElement.$eval(
      'td.date',
      (element) => element.textContent,
    );
    const boardDate = stringToDateObject(boardDateString);

    const title = await postHandleElement.$eval(
      'td.title > a',
      (element) => element.textContent,
    );

    const postLink = await postHandleElement.$eval(
      'td.title > a',
      (element) => element.href,
    );
    result.push({ title, boardDate, postLink });
  }
  return result;
}
