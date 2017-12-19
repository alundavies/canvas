// alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
// chrome --headless --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
// chrome --hide-scrollbars --remote-debugging-port=9222 --disable-gpu &
// chrome --hide-scrollbars --remote-debugging-port=9222 &
// npm use v8    (version 8 of node, run from within bash shell)

const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const file = require('fs');

// CLI Args
const url = argv.url || 'http://news.bbc.co.uk';
const format = argv.format === 'jpeg' ? 'jpeg' : 'png';
const viewportWidth = argv.viewportWidth || 1440;
const viewportHeight = argv.viewportHeight || 10000;
const delay = argv.delay || 0;
const userAgent = argv.userAgent || 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.82 Mobile Safari/537.36';
const fullPage = argv.full;

// Start the Chrome Debugging Protocol
CDP(async function(client) {
    // Extract used DevTools domains.
    const {DOM, Emulation, Network, Page, Runtime} = client;

    // Enable events on domains we are interested in.
    await Page.enable();
    await DOM.enable();
    await Network.enable();

    // If user agent override was specified, pass to Network domain
    if (userAgent) {
        await Network.setUserAgentOverride({userAgent});
    }

    // Set up viewport resolution, etc.
    const deviceMetrics = {
        width: viewportWidth,
        height: viewportHeight,
        deviceScaleFactor: 0,
        mobile: false,
        fitWindow: false,
    };
    await Emulation.setDeviceMetricsOverride(deviceMetrics);
    await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight});

    // Navigate to target page
    await Page.navigate({url});

    // Wait for page load event to take screenshot
    Page.loadEventFired(async () => {
        // If the `full` CLI option was passed, we need to measure the height of
        // the rendered page and use Emulation.setVisibleSize
        if (fullPage) {
            console.log( 'fullpage on')
            const {root: {nodeId: documentNodeId}} = await DOM.getDocument();
            const {nodeId: bodyNodeId} = await DOM.querySelector({
                selector: 'body',
                nodeId: documentNodeId,
            });
            const {model: {height}} = await DOM.getBoxModel({nodeId: bodyNodeId});

            await Emulation.setVisibleSize({width: viewportWidth, height: height});
            // This forceViewport call ensures that content outside the viewport is
            // rendered, otherwise it shows up as grey. Possibly a bug?
            await Emulation.forceViewport({x: 0, y: 0, scale: 1});
        }

        setTimeout(async function() {
            const config = {format:format, fromSurface:true};  // best results with fromSurface = true
            console.log( JSON.stringify( config));
            const screenshot = await Page.captureScreenshot( config);

            const buffer = new Buffer(screenshot.data, 'base64');
            file.writeFile('output.png', buffer, 'base64', function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Screenshot saved');
                }
                client.close();
            });
        }, delay);
    });
}).on('error', err => {
    console.error('Cannot connect to browser:', err);
});