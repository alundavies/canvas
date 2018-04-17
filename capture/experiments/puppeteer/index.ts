
import * as puppeteer from 'puppeteer';
import * as as from 'async-file';

puppeteer.launch({
    ignoreHTTPSErrors: true,
    timeout: 5000,

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
        await page.goto(
            //'file:///Users/alundavies/shadows/canvas/Users/alundavies/git/canvas/burner/src/layer-management/TileFileCopier.ts.html',
            'file:///Users/alundavies/shadows/canvas/Users/alundavies/git/canvas/file-commands/CommandParams.ts.html',
            {

            waitUntil: 'domcontentloaded' //'networkidle0' // 'networkidle2'  //'load'
        });
        console.log( 'Grabbing screenshot')
        await as.unlink( 'screenshot.png');
        await page.screenshot({path: 'screenshot.png', fullPage:true});
    } catch( e){
        console.error( 'Caught error: ', e);
    } finally {
        await browser.close();
    }
});