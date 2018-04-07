
import * as puppeteer from 'puppeteer';

puppeteer.launch({
    ignoreHTTPSErrors: true,
    timeout: 20000
}).then(async (browser:any) => {
    console.log( 'Browser launched');
    const page = await browser.newPage();
    console.log( 'New Page created')
    try {
        let device = {
            viewport: {
                width: 1000,
                height: 1000,
                deviceScaleFactor: 2
            },
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.40 Safari/537.36'
        }

        await page.emulate( device);
        console.log( 'Emulation succeeded');
        await page.goto('http://www.mirror.co.uk/sport/formula-1/michael-schumacher-ski-accident-10360005',{

            waitUntil: 'domcontentloaded' //'networkidle0' // 'networkidle2'  //'load'
        });
        console.log( 'Grabbing screenshot')
        await page.screenshot({path: 'screenshot.png', fullPage:true});
    } catch( e){
        console.error( 'Caught error: ', e);
    } finally {
        await browser.close();
    }
});