"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const puppeteer = require('puppeteer');
puppeteer.launch({
    ignoreHTTPSErrors: true,
    timeout: 20000
}).then((browser) => __awaiter(this, void 0, void 0, function* () {
    console.log('Browser launched');
    const page = yield browser.newPage();
    console.log('New Page created');
    try {
        let device = {
            viewport: {
                width: 1000,
                height: 1000,
                deviceScaleFactor: 2
            },
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.40 Safari/537.36'
        };
        yield page.emulate(device);
        console.log('Emulation succeeded');
        yield page.goto('http://www.mirror.co.uk/sport/formula-1/michael-schumacher-ski-accident-10360005', {
            waitUntil: 'domcontentloaded' //'networkidle0' // 'networkidle2'  //'load'
        });
        console.log('Grabbing screenshot');
        yield page.screenshot({ path: 'screenshot.png', fullPage: true });
    }
    catch (e) {
        console.error('Caught error: ', e);
    }
    finally {
        yield browser.close();
    }
}));
//# sourceMappingURL=index.js.map