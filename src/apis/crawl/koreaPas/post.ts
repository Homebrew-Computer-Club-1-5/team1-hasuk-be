import * as puppeteer from 'puppeteer';
import { launchNewPage } from '../commons/launchNewPage';
import { getBoardDateSelector as getPostDateSelector } from './selectors';

const contactNumberRegExp = /\d{2,3}(-|\.|\s*)\d{3,4}(-|\.|\s*)\d{3,4}/gm;

interface IgetCrawlPostResults {
  postUrls: string[];
  browser: puppeteer.Browser;
  crawlUntil: Date;
  house_category_id: number;
}
export async function getCrawlPostResults({
  postUrls,
  browser,
  crawlUntil,
  house_category_id,
}: IgetCrawlPostResults) {
  const result = [];
  for (let i = 0; i < postUrls.length; i++) {
    const postUrl = postUrls[i];
    const newPage = await launchNewPage({ browser });
    const { otherInfo, contactNumber, imgUrls, postDate } = await crawlPost({
      postUrl,
      page: newPage,
    });
    if (crawlUntil >= postDate) break;
    result.push({
      boardDate: postDate.getTime(),
      contactNumber,
      homeImgUrls: imgUrls,
      otherInfo,
      house_category_id,
    });
    await newPage.close();
  }
  return result;
}

interface IcrawlPost {
  postUrl: string;
  page: puppeteer.Page;
}
export async function crawlPost({ postUrl, page }: IcrawlPost) {
  await page.goto(postUrl);
  const otherInfo = await crawlOtherInfo({ page });
  const contactNumber = extractContactNumberFromOtherInfo({ otherInfo });
  const imgUrls = await crawlImgUrls({ page });
  const postDate = await crawlPostDate({ page });

  return { otherInfo, contactNumber, imgUrls, postDate };
}

interface IcrawlOtherInfo {
  page: puppeteer.Page;
}

async function crawlOtherInfo({ page }: IcrawlOtherInfo) {
  let otherInfo = await page.$eval(
    '#bonmoon > tbody > tr:nth-child(1) > td > div',
    (element) => element.textContent as string,
  );
  // 출처삭제
  const refIndex = otherInfo.indexOf('출처 : 고려대학교 고파스');
  otherInfo = otherInfo.substring(0, refIndex);
  return otherInfo;
}

interface IextractContactNumberFromOtherInfo {
  otherInfo: string;
}
function extractContactNumberFromOtherInfo({
  otherInfo,
}: IextractContactNumberFromOtherInfo) {
  const contactNumberMatchResult = otherInfo?.match(contactNumberRegExp);
  let contactNumber: string;
  if (contactNumberMatchResult !== null) {
    contactNumber = (contactNumberMatchResult as any)[0];
    contactNumber = contactNumber.replace(/\D/gm, '');
  } else {
    contactNumber = '01012345678';
  }
  return contactNumber;
}

interface IcrawlImgUrls {
  page: puppeteer.Page;
}
async function crawlImgUrls({ page }: IcrawlImgUrls) {
  const imgUrls = await page.$$eval('img[id^=gifb_]', (elements) =>
    elements.map((element) => element.src),
  );
  return imgUrls;
}

interface IcrawlPostDate {
  page: puppeteer.Page;
}
async function crawlPostDate({ page }: IcrawlPostDate): Promise<Date> {
  const postDateSelector = await getPostDateSelector({ page });
  let postDate = await page.$eval(
    postDateSelector,
    (element) => element.textContent as string,
  );
  // 앞부분 정제
  postDate = postDate.replace('등록일 : ', '');
  // 뒷부분 정제
  // i. ~시간 전 부분 있으면 삭제
  if (postDate.includes('전')) {
    const openBracketIndex = postDate.indexOf('(') - 1;
    postDate = postDate.slice(0, openBracketIndex);
    // ii. 없으면 공백 삭제
  } else {
    const lastEmptyIndex = postDate.lastIndexOf(' ');
    postDate = postDate.slice(0, postDate.lastIndexOf(' '));
  }
  // '2023-01-10 12:38:52' 형식으로 정제 완료 후 timestamp 형식으로 전환
  return new Date(postDate);
}
