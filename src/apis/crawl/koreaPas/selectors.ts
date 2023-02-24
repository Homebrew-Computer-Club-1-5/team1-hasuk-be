import * as puppeteer from 'puppeteer';

export const allPostsSelector =
  '#revolution_main_table > tbody > tr.list0, tr.list1';

interface IcheckIsRecentPost {
  page: puppeteer.Page;
}

export async function getBoardDateSelector({ page }: IcheckIsRecentPost) {
  let boardDateSelector = 4;
  const isRecentText = await page.$eval(
    'body > div > div:nth-child(7) > div > table:nth-child(14) > tbody > tr > td:nth-child(2) > span:nth-child(4)',
    (element) => element.textContent,
  );
  if ((isRecentText as any).length <= 10) {
    // innerText가 category_name 일경우
    boardDateSelector = 5;
  }

  return `body > div > div:nth-child(7) > div > table:nth-child(14) > tbody > tr > td:nth-child(2) > span:nth-child(${boardDateSelector})`;
}
