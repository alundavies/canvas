/**
 * Created by alundavies on 09/04/2018.
 */

import {isUndefined} from "util";
import * as af from "async-file";
import * as fs from "fs";

export default class TileFileMover {

    static async move( inputDirectory: string,
                       level: number,
                       destinationLevel? : number,
                       startTileX?: number, startTileY?: number,
                       destinationTileX? : number, destinationTileY?: number,
                       endTileXInclusive?: number, endTileYInclusive?: number,
                       inputFilePrefix?: string,
                       outputDirectory?: string,  outputFilePrefix?:string) {

        destinationLevel = isUndefined( destinationLevel) ? level : destinationLevel;
        startTileX = isUndefined( startTileX) ? 0 : startTileX;
        startTileY = isUndefined( startTileY) ? 0 : startTileY;

        // maybe defaults for this should be difference in level doubled or divided to maintain relative position
        destinationTileX = isUndefined( destinationTileX) ? 0 : destinationTileX;
        destinationTileY = isUndefined( destinationTileY) ? 0 : destinationTileY;

        endTileXInclusive = isUndefined( endTileXInclusive) ? -1 : endTileXInclusive;
        endTileYInclusive = isUndefined( endTileYInclusive) ? -1 : endTileYInclusive;

        outputDirectory = isUndefined(outputDirectory) ? inputDirectory : outputDirectory;
        inputFilePrefix = isUndefined(inputFilePrefix) ? '' : inputFilePrefix;
        outputFilePrefix = isUndefined(outputFilePrefix) ? inputFilePrefix : outputFilePrefix;

        let commandId : string = Date.now().toString();

        let files: string[] = await af.readdir(inputDirectory);

        let pattern = `^${inputFilePrefix}(\\d+)_(\\d+)_(\\d+).*png$`;
        let regexp = new RegExp( pattern, 'i');

        let deltaX : number = destinationTileX-startTileX;
        let deltaY : number = destinationTileY-startTileY;

        let stats = { matching:0};
        for (let file of files) {

            let matched = regexp.exec( file);

            if( matched!=null){

                let fileLevel : number = parseInt( matched[1]);
                let x : number = parseInt( matched[2]);
                let y : number = parseInt( matched[3]);

                if( fileLevel==level && x>=startTileX && y>=startTileY
                    && ( x<=endTileXInclusive || endTileXInclusive<0)
                    &&  ( y<=endTileYInclusive || endTileYInclusive<0) ) {

                    stats.matching+=1;

                    let destX = x+deltaX;
                    let destY = y+deltaY;
                    console.log( `Will move ${file} - level: ${level}  x: ${x}  y: ${y} to x': ${destX}  y': ${destY} `);

                    // to avoid overwriting we're going to move twice - we could optimise this to move tiles in a different
                    // order depending on direction of travel, but by renaming to include the filename we would be able to
                    // pickup on a failed move (if that becomes a thing!)
                    let destFile : string = outputDirectory+`/.command.id_${commandId}.mv.xy_${destX}_${destY}_file_`+file;
                    await TileFileMover.fileMove( inputDirectory+'/'+file, destFile);

                }
            } else {
                console.log(`Nope ${file}`);
            }

        }
        console.log( `Found ${stats.matching} out of ${files.length} files `);

    }

    static async fileMove( inFile: string, outFile: string) {
        fs.copyFileSync( inFile, outFile, fs.constants.COPYFILE_EXCL);
        //await af.rename( inFile, outFile);
    }
}