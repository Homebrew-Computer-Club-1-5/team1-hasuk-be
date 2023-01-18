import * as puppeteer from 'puppeteer';
import Xvfb from '@cypress/xvfb';

export async function setBrowserConfigs() {
  // xvfb 셋팅
  // var xvfb = new Xvfb({
  //   silent: true,
  //   xvfb_args: ['-screen', '0', '1280x720x24', '-ac'],
  // });
  // xvfb.start((err) => {
  //   if (err) console.error(err);
  // });
  //1. 브라우저 켜고
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'local' ? false : true,
    executablePath: process.env.CRAWL_EXECUTABLEPATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // '--no-zygote',
      // '--single-process',
      // '--disable-gpu',
      // '--disable-dev-shm-usage',
      // '--display=' + xvfb._display,
    ],
    // dumpio: true,
  });
  //2. 새탭 열기

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  //3. 크기조정

  //4. 인코딩
  // await page.setExtraHTTPHeaders({
  //   'Content-Type': 'text/html; charset=utf-8',
  // });

  return { page, browser };
}
