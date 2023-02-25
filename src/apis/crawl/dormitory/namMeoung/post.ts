import { ElementHandle } from 'puppeteer';
import { IcrawlPostResult } from '../types';
import {
  postDateSelector,
  postLinkSelector,
  postTitleSelector,
} from './selectors';
import { extractPostIdFromOnClick } from './util';

interface IgetResults {
  posts: ElementHandle<HTMLTableRowElement>[];
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

    const postOnClickAttribute = await postHandleElement.$eval(
      postLinkSelector,
      (element) => element.getAttribute('onclick'),
    );
    const postID = extractPostIdFromOnClick(postOnClickAttribute);

    const postLink =
      'http://www.nmhs.or.kr/boardview.do?seqId=0000000286&BBS_ID=F44D111121764A9C9AE87A0C337C1FD3&IPDS_IDX=' +
      postID;

    result.push({ postTitle, postDate, postLink });
  }
  return result;
}
