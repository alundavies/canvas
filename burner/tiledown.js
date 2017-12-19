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
const gm = require("gm");
const async = require("async");
const fs = require("async-file");
const Q = require("q");
var imageMagick = gm.subClass({ imageMagick: true });
let im = imageMagick; // cast to any, because montage missing in type description
let maxTilesHorizontally = 512;
let maxTilesVertically = 512;
let maxZoom = 10;
function updateFilenamesIfNotExisting(filenames) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 0;
        for (let filenameIdx in filenames) {
            let exists = yield fs.exists(filenames[filenameIdx]);
            if (!exists) {
                //console.log( filenames[filenameIdx], 'does not exist');
                filenames[filenameIdx] = '../capture/images/defaults/blank.png';
                count += 1;
            }
        }
        return count != filenames.length;
    });
}
;
let singleZoomOut = (zoom, xLeftTile, yTopTile, xRightTile, yBottomTile) => __awaiter(this, void 0, void 0, function* () {
    let higherZoom = zoom + 1;
    console.log(`singleZoomOut starts - zoom: ${zoom}, tile co-ordinates: ${xLeftTile},${yTopTile} - ${xRightTile},${yBottomTile}`);
    xLeftTile = xLeftTile ? xLeftTile : 0;
    yTopTile = yTopTile ? yTopTile : 0;
    xRightTile = xRightTile != null ? xRightTile : maxTilesHorizontally / Math.pow(2, maxZoom - zoom);
    yBottomTile = yBottomTile != null ? yBottomTile : maxTilesVertically / Math.pow(2, maxZoom - zoom);
    let tasks = new Array((xRightTile - xLeftTile + 1) * (yBottomTile - yTopTile + 1));
    let taskCount = 0;
    // bug: <= should just be <, odd bottom or right requires <= after dividing but not even
    for (let x = xLeftTile; x <= xRightTile; x += 1) {
        for (let y = yTopTile; y <= yBottomTile; y += 1) {
            console.log(`Individual tile generation zoom=${zoom} x=${x} y=${y}`);
            let higherZoomedX = x * 2;
            let higherZoomedY = y * 2;
            let inFileNames = [
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX}_${higherZoomedY}.png`,
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX + 1}_${higherZoomedY}.png`,
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX}_${higherZoomedY + 1}.png`,
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX + 1}_${higherZoomedY + 1}.png`
            ];
            tasks[taskCount] = (function (callback) {
                return __awaiter(this, void 0, void 0, function* () {
                    /* if( x%10==0 && y%10==0) {
                         console.log( `zoom: ${zoom} x: ${x} y: ${y}`)
                     }*/
                    let anyExist = yield updateFilenamesIfNotExisting(inFileNames);
                    let outputFileName = `../capture/images/tiles/zoom_${zoom}_${x}_${y}.png`;
                    if (yield fs.exists(outputFileName)) {
                        yield fs.delete(outputFileName);
                    }
                    if (anyExist) {
                        im(inFileNames[3])
                            .montage(inFileNames[0])
                            .montage(inFileNames[1])
                            .montage(inFileNames[2])
                            .tile('2x2').gravity("NorthWest").geometry('128x128>+0+0').write(outputFileName, () => {
                            //console.log('Generated Zoomed Out Tile', new Date());
                            callback();
                        });
                    }
                    else {
                        callback();
                    }
                });
            });
            taskCount += 1;
        }
    }
    let allDonePromise = Q.defer();
    tasks.length = taskCount;
    async.parallelLimit(tasks, 10, function () {
        allDonePromise.resolve();
    });
    return allDonePromise.promise;
});
// Regenerate EVERYTHING
function doItAll(maxZoom) {
    return __awaiter(this, void 0, void 0, function* () {
        var start = new Date();
        //await singleZoom(8);
        for (let zoom = maxZoom - 1; zoom >= 1; zoom -= 1) {
            yield singleZoomOut(zoom);
        }
        console.log(start, " ", new Date());
    });
}
;
// doItAll( maxZoom);
// Invalidate region and build affected layers down
function invalidateRegion(zoomLevel, xLeftTile, yTopTile, xRightTile, yBottomTile) {
    return __awaiter(this, void 0, void 0, function* () {
        // At this point tiles at 'zoom' level will have been painted...so just want to generate downwards
        // we'll do a maximum of 8 levels -- check to see if 9 necessary later
        for (let zoom = zoomLevel - 1; zoom >= 1 && zoom >= zoomLevel - 8; zoom -= 1) {
            let divider = zoomLevel - zoom;
            yield singleZoomOut(zoom, xLeftTile >> divider, yTopTile >> divider, xRightTile >> divider, yBottomTile >> divider);
        }
    });
}
invalidateRegion(10, 7, 7, 8, 8).catch();
//# sourceMappingURL=tiledown.js.map