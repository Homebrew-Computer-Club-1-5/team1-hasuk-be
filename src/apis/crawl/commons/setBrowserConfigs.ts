import * as puppeteer from 'puppeteer';

export async function setBrowserConfigs() {
  //1. 브라우저 켜고
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'development.local' ? false : true,
    executablePath: process.env.CRAWL_EXECUTABLEPATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  return browser;
}
