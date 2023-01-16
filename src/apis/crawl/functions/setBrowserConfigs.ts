import * as puppeteer from 'puppeteer';

export async function setBrowserConfigs(){
    //1. 브라우저 켜고
    const browser = await puppeteer.launch({headless : false,devtools:true,executablePath :'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
    //2. 새탭 열기
    const page = await browser.newPage();
    //3. 크기조정
    await page.setViewport({width: 1280, height:720})
    
    return {page,browser}
}

