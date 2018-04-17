"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const navalia_1 = require("navalia");
const fs = require("fs");
const chrome = new navalia_1.Chrome({ flags: { headless: true } });
let anyChrome = chrome;
/*, { coverage: false, onload: true, timeout: 10000}*/
function doIt() {
    return __awaiter(this, void 0, void 0, function* () {
        //await chrome.size( 100, 100).scroll();
        yield chrome.header({ 'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.82 Mobile Safari/537.36' });
        yield chrome.goto('http://www.bbc.com/sport', {
            coverage: false,
            onload: true,
            timeout: 30000
        });
        yield anyChrome.cdp.Emulation.setDeviceMetricsOverride({ width: 900, height: 12000, positionX: 1, positionY: 1, offsetX: 0, offsetY: 0,
            screenWidth: 400, screenHeight: 4000, scale: 1, mobile: false, deviceScaleFactor: 3 }); // 3 seems to be highest scaleFactor
        yield chrome.wait(13000);
        let data = yield chrome.screenshot('body');
        fs.writeFile(`./images/bbc_sport_x3.png`, data, 'base64', function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log(`Screenshot saved`);
            }
            chrome.done();
        });
    });
}
;
try {
    doIt();
}
catch (e) {
    console.error(e);
}
//# sourceMappingURL=navalia.js.map