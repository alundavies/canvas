"use strict";
// alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
// chrome --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
// chrome --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
// chrome --hide-scrollbars --remote-debugging-port=9222 &
// npm use v8    (version 8 of node, run from within bash shell)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// when chrome updates you may have to make Settings.dat in it's framework directory writable by user
//import * as _ from 'lodash';
//const _ = require( 'lodash');
const urls = require('./urls.js').urls;
const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const file = require('fs');
//_.each( urls, url => { console.log( url.url) });
// CLI Args
const url = argv.url || 'http://news.bbc.co.uk';
const format = argv.format === 'jpeg' ? 'jpeg' : 'png';
const viewportWidth = argv.viewportWidth || 1440;
const viewportHeight = argv.viewportHeight || 10000;
const timeoutDelay = 30000;
const userAgent = argv.userAgent || 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.82 Mobile Safari/537.36'; // really important to include userAgent for some sites (notably news.bbc.co.uk)
const fullPage = true; //argv.full;
function timeout(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}
// Start the Chrome Debugging Protocol
CDP(function (client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extract used DevTools domains.
            const { DOM, Emulation, Network, Page, Runtime } = client;
            // Enable events on domains we are interested in.
            yield Page.enable();
            yield DOM.enable();
            yield Network.enable();
            // If user agent override was specified, pass to Network domain
            if (userAgent) {
                yield Network.setUserAgentOverride({ userAgent });
            }
            for (var url of urls) {
                console.log(`Working on ${url.name}`);
                // Set up viewport resolution, etc.
                const deviceMetrics = {
                    width: viewportWidth,
                    height: viewportHeight,
                    deviceScaleFactor: 0,
                    mobile: false,
                    fitWindow: false,
                };
                yield Emulation.setDeviceMetricsOverride(deviceMetrics);
                yield Emulation.setVisibleSize({ width: viewportWidth, height: viewportHeight });
                // Wait for page load event to take screenshot
                Page.loadEventFired(() => __awaiter(this, void 0, void 0, function* () {
                    console.log('load event fired');
                    try {
                        // If the `full` CLI option was passed, we need to measure the height of
                        // the rendered page and use Emulation.setVisibleSize
                        if (fullPage) {
                            console.log('fullpage on');
                            const { root: { nodeId: documentNodeId } } = yield DOM.getDocument();
                            console.log("document node id = " + documentNodeId);
                            const { nodeId: bodyNodeId } = yield DOM.querySelector({
                                selector: 'body',
                                nodeId: documentNodeId,
                            });
                            const { model: { height } } = yield DOM.getBoxModel({ nodeId: bodyNodeId });
                            yield Emulation.setVisibleSize({ width: viewportWidth, height: height });
                            // This forceViewport call ensures that content outside the viewport is
                            // rendered, otherwise it shows up as grey. Possibly a bug?
                            yield Emulation.forceViewport({ x: 0, y: 0, scale: 1 });
                        }
                        const config = { format: format, fromSurface: true }; // best results with fromSurface = true
                        console.log(JSON.stringify(config));
                        yield timeout(timeoutDelay);
                        const screenshot = yield Page.captureScreenshot(config);
                        const buffer = new Buffer(screenshot.data, 'base64');
                        file.writeFile(`./images/${url.name}.png`, buffer, 'base64', function (err) {
                            if (err) {
                                console.error(err);
                            }
                            else {
                                console.log(`Screenshot saved ${url.name}`);
                            }
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }));
                // Navigate to target page
                console.log(`Navigating to ${url.url}`);
                yield Page.navigate({ url: url.url });
                console.log('Starting to wait');
                yield timeout(timeoutDelay + 5000); // add 10 s for screenshot
                console.log('Ended waiting');
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            // close the client
            console.log("Closing client");
            client.close();
        }
    });
}).on('error', (err) => {
    console.error('Cannot connect to browser:', err);
});
//# sourceMappingURL=capture.js.map