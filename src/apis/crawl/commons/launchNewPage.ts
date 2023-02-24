import * as puppeteer from 'puppeteer';

interface IlaunchNewPage {
  browser: puppeteer.Browser;
}

export async function launchNewPage({ browser }: IlaunchNewPage) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  return page;
}
