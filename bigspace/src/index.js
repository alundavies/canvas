"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by alundavies on 05/08/2017.
 */
const _ = require("lodash");
const gm = require("gm");
const async = require("async");
const _2d_bin_packer_layout_1 = require("./layout/2d-bin-packer/2d-bin-packer-layout");
;
let tiles = [{
        width: 256,
        height: 256,
        z: 0,
        x: 0,
        y: 0
    }];
function invalidateTile(tile) {
    console.log(`Invalidating tile: ${tile.z} ${tile.x} ${tile.y}`);
    if (tile.z >= 1) {
        let lowerTile = _.clone(tile);
        lowerTile.z -= 1;
        lowerTile.x = Math.floor(tile.x / 2);
        lowerTile.y = Math.floor(tile.y / 2);
        invalidateTile(lowerTile);
    }
}
invalidateTile({ z: 5, x: 10, y: 9 });
function twoDLayout(blocks) {
    let layout = new _2d_bin_packer_layout_1.TwoDimensionalBinPackerLayout();
    layout.layout(blocks);
    layout.normalise(blocks);
    for (let block of blocks) {
        if (block.fit) {
            console.log(`Block fit = x:${block.fit.x} y:${block.fit.y} width:${block.fit.width} height:${block.fit.height}`);
        }
        else {
            console.log('No .fit in block');
        }
    }
}
;
twoDLayout([
    { x: 10, y: 10, width: 30, height: 30 },
    { x: 50, y: 10, width: 30, height: 30 },
    { x: 150, y: 110, width: 80, height: 80 },
]);
var imageMagick = gm.subClass({ imageMagick: true });
//imageMagick( './bbc.png').mosaic( ['./bbc.png', './bbc.png']).write( './bbc_charcoal.png', () => { console.log('charcoaled it')});
//imageMagick( './bbc.png').write( './bbc_charcoal.png', () => { console.log('charcoaled it')});
/// TS_IGNORE
let im = imageMagick; // cast to any, because montage missing in type description
let start = (done) => {
    im('../capture/images/bbc.png').montage('../capture/images/spacex.png').montage('../capture/images/bbc_technology.png')
        .montage('../capture/images/github_canvas_indexhtml.png').tile('2x2').geometry('128x128>+0+0').write('./bbc_montage.png', () => {
        console.log('montaged it');
        console.log(new Date());
        done();
    });
};
let callback = (done) => {
    im('./bbc_montage.png').montage('./bbc_montage.png').montage('./bbc_montage.png')
        .montage('./bbc_montage.png').tile('2x2').geometry('128x128>+0+0').write('./bbc_montage.png', () => {
        console.log('sub montaged it');
        console.log(new Date());
        done();
    });
};
let calls = [start];
for (let i = 0; i < 4; i += 1) {
    calls.push(callback);
}
async.series(calls);
//# sourceMappingURL=index.js.map