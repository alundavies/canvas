import * as _ from 'lodash';
import * as gm from 'gm';
import * as async from 'async';
import * as fs from 'async-file';
import * as Q from 'q';


var imageMagick = gm.subClass({ imageMagick: true });

let im : any = imageMagick;  // cast to any, because montage missing in type description

let maxTilesHorizontally : number = 512;
let maxTilesVertically : number = 512;
let maxZoom : number = 10;

async function updateFilenamesIfNotExisting(filenames: string[]) : Promise<boolean> {
    let count : number = 0;
    for( let filenameIdx in filenames){

        let exists = await fs.exists( filenames[filenameIdx]);
        if( !exists){
            //console.log( filenames[filenameIdx], 'does not exist');
            filenames[filenameIdx]='../capture/images/defaults/blank.png';
            count+=1;
        }
    }
    return count != filenames.length;
};



let singleZoomOut = async ( zoom: number, xLeftTile? : number, yTopTile? : number, xRightTile? : number, yBottomTile? : number) => {

    let higherZoom : number = zoom + 1;

    console.log( `singleZoomOut starts - zoom: ${zoom}, tile co-ordinates: ${xLeftTile},${yTopTile} - ${xRightTile},${yBottomTile}`);

    xLeftTile = xLeftTile ? xLeftTile : 0;
    yTopTile = yTopTile ? yTopTile : 0;
    xRightTile = xRightTile != null ? xRightTile : maxTilesHorizontally/Math.pow(2, maxZoom-zoom);
    yBottomTile = yBottomTile !=null ? yBottomTile : maxTilesVertically/Math.pow(2, maxZoom-zoom);

    let tasks = new Array( (xRightTile-xLeftTile+1)*(yBottomTile-yTopTile+1));
    let taskCount : number = 0;

    // bug: <= should just be <, odd bottom or right requires <= after dividing but not even

    for( let x=xLeftTile; x<=xRightTile; x+=1) {

        for( let y=yTopTile; y<=yBottomTile; y+=1) {

            console.log( `Individual tile generation zoom=${zoom} x=${x} y=${y}`);

            let higherZoomedX = x*2;
            let higherZoomedY = y*2;
            let inFileNames = [
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX}_${higherZoomedY}.png`,
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX+1}_${higherZoomedY}.png`,
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX}_${higherZoomedY+1}.png`,
                `../capture/images/tiles/zoom_${higherZoom}_${higherZoomedX+1}_${higherZoomedY+1}.png`
            ];

            tasks[ taskCount]=(
                async function (callback: Function) {

                   /* if( x%10==0 && y%10==0) {
                        console.log( `zoom: ${zoom} x: ${x} y: ${y}`)
                    }*/

                    let anyExist : boolean = await updateFilenamesIfNotExisting( inFileNames);

                    let outputFileName: string = `../capture/images/tiles/zoom_${zoom}_${x}_${y}.png`;

                    if (await fs.exists(outputFileName)) {
                        await fs.delete(outputFileName);
                    }

                    if( anyExist) {
                        im(inFileNames[3])
                            //.pointSize(50).fill('red').draw(`text 120, 120 '${zoom}'`)
                            .montage(inFileNames[0])
                            .montage(inFileNames[1])
                            .montage(inFileNames[2])
                            .tile('2x2').gravity("NorthWest").geometry('128x128>+0+0').write(outputFileName,
                            () => {
                                //console.log('Generated Zoomed Out Tile', new Date());
                                callback();
                            }
                        );
                    } else {
                        callback();
                    }
                }
            );

            taskCount+=1;
        }
    }

    let allDonePromise = Q.defer();
    tasks.length = taskCount;
    async.parallelLimit( tasks, 10, function(){
        allDonePromise.resolve();
    });
    return allDonePromise.promise;
};

// Regenerate EVERYTHING
async function doItAll( maxZoom: number){

    var start = new Date();
    //await singleZoom(8);
    for( let zoom=maxZoom-1; zoom>=1; zoom-=1) {

        await singleZoomOut( zoom);
    }
    console.log( start, " ", new Date());
};

// doItAll( maxZoom);


// Invalidate region and build affected layers down
async function invalidateRegion( zoomLevel : number, xLeftTile : number , yTopTile : number , xRightTile : number, yBottomTile : number) {
    // At this point tiles at 'zoom' level will have been painted...so just want to generate downwards

    // we'll do a maximum of 8 levels -- check to see if 9 necessary later
    for( let zoom=zoomLevel-1; zoom>=1 && zoom>=zoomLevel-8; zoom-=1) {
        let divider : number = zoomLevel-zoom;

        await singleZoomOut( zoom, xLeftTile>>divider, yTopTile>>divider, xRightTile>>divider, yBottomTile>>divider);
    }
}


invalidateRegion( 10, 7, 7, 8, 8).catch();

