import { Chrome } from 'navalia';
import * as fs from 'fs';
import { Buffer } from 'Buffer';

const chrome = new Chrome( { flags: { headless: true}});

let anyChrome : any = chrome;


/*, { coverage: false, onload: true, timeout: 10000}*/

async function doIt() {

        //await chrome.size( 100, 100).scroll();

        await chrome.header( {'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.82 Mobile Safari/537.36' });

        await chrome.goto( 'http://www.bbc.com/sport', {
            coverage: false,
            onload: true,
            timeout: 30000
        });

        await anyChrome.cdp.Emulation.setDeviceMetricsOverride(
        { width: 900, height: 12000, positionX: 1, positionY: 1, offsetX:0, offsetY: 0,
            screenWidth: 400, screenHeight: 4000, scale: 1, mobile: false, deviceScaleFactor: 3});  // 3 seems to be highest scaleFactor



        await chrome.wait(13000);

        let data : Buffer = await chrome.screenshot('body');

        fs.writeFile( `./images/bbc_sport_x3.png`, data, 'base64', function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log(`Screenshot saved`);
            }
            chrome.done();
        });

};

try{
    doIt();
} catch( e){
    console.error( e);
}