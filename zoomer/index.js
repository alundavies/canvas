"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const fs = require("fs");
const spdy = require("spdy");
var app = express();
app.use('/openseadragon/src/', express.static('../../openseadragon/build/openseadragon'));
app.use('/openseadragon/', express.static('.'));
/*app.use( '/openseadragon/bbcsport.dzi', express.static('bbcsport.dzi'))
app.use( '/openseadragon/bbcnews.dzi', express.static('bbcnews.dzi'))
app.use( '/openseadragon/mashable_files', express.static('mashable_files'))
app.use( '/openseadragon/bbcsport_files', express.static('bbcsport_files'))
app.use( '/openseadragon/bbcnews_files', express.static('bbcnews_files'))
app.use( '/openseadragon/output_files', express.static('output_files'))*/
app.use('/', express.static('src'));
app.get('/openlayers/:layerName/:z/:x/:y.png', function (req, res) {
    //res.send( `${req.params['z']} ${req.params['x']} ${req.params['y']}`);
    // send a matching tile
    //var fileName = ""; //`${parseInt(req.params['z'])+7}/${req.params['x']}_${req.params['y']}.png`;
    // fileName = path.join(__dirname, 'bbc_files', fileName)
    let Z = parseInt(req.params['z']);
    let X = parseInt(req.params['x']);
    let Y = parseInt(req.params['y']);
    let layerName = req.params['layerName'];
    let fileName = path.join(__dirname, `../../../tiles/layers/${layerName}/${Z}_${X}_${Y}.png`);
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(fileName);
    console.log(`${req.params['z']} ${req.params['x']} ${req.params['y']} -> ${fileName}`);
    // res.end();
});
// http server
app.listen(29001, function () {
    console.log('Zoomer listening on port 29001 (http1)');
});
// http2 server
let http2Options = {
    key: fs.readFileSync(__dirname + '/server.key'),
    cert: fs.readFileSync(__dirname + '/server.crt')
};
spdy.createServer(http2Options, app)
    .listen(29002, (error) => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }
    else {
        console.log('Listening on port: ' + 29002 + ' (http2)');
    }
});
//# sourceMappingURL=index.js.map