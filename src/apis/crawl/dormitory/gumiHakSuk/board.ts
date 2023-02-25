import { ElementHandle } from 'puppeteer';
import { IcrawlPostResult } from '../types';
import {
  postDateSelector,
  postLinkSelector,
  postTitleSelector,
} from './selectors';
// import { stringToDateObject } from './util';

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
    const boardDateString = await postHandleElement.$eval(
      postDateSelector,
      (element) => element.textContent,
    );
    const postDate = new Date(boardDateString);
    if (postDate >= crawlUntil) result.push(postHandleElement);
  }
  return result;
}

export async function getResults({ posts }) {
  const result: IcrawlPostResult[] = [];
  for (let i = 0; i < posts.length; i++) {
    const postHandleElement = posts[i];
    const postDateString = await postHandleElement.$eval(
      postDateSelector,
      (element) => element.textContent,
    );
    const postDate = new Date(postDateString);

    const postTitle = await postHandleElement.$eval(
      postTitleSelector,
      (element) => element.textContent,
    );

    const postLink = await postHandleElement.$eval(
      postLinkSelector,
      (element) => element.href,
    );
    result.push({ postTitle, postDate, postLink });
  }
  return result;
}
