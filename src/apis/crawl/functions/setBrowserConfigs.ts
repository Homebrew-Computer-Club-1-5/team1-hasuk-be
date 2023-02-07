import * as puppeteer from 'puppeteer';

export async function setBrowserConfigs() {
  //1. 브라우저 켜고
  const browser = await puppeteer.launch({
    headless: true,
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

  return { page, browser };
}
