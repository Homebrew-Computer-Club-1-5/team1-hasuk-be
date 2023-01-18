import * as puppeteer from 'puppeteer';
import { Iauth } from './crawl';

export async function login(page: puppeteer.Page, { id, pw }: Iauth) {
  // 1. 아이디 비번 치기
  await page.evaluate(
    (id, pw) => {
      (
        document.querySelector('input[name="user_id"]') as HTMLInputElement
      ).value = id;
      (
        document.querySelector('input[name="password"]') as HTMLInputElement
      ).value = pw;
    },
    id,
    pw,
  );
  // 2. 로그인 누르기
  await page.click(
    'body > div > div:nth-child(7) > div:nth-child(2) > div > table:nth-child(2) > tbody > tr > td:nth-child(2) > form > div > div > input',
  );
  return;
}
