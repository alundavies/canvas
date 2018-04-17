/**
 * Created by alundavies on 09/04/2018.
 */

/*
 Copy tiles from one region of space to another, can be same layer or another

 Improvements could be made to avoid renaming some files, mechanism which is in place to ensure we don't overwrite
 original tiles until all have been copied, but if there is not overlap then we don't really have to worry about that

 */
import {isUndefined} from "util"
import * as af from "async-file"
import Files from "../file-io/Files"
import {Direction} from "../Direction"
import TileRange from "../TileRange";

export default class TileFileCopier {

    static async copy(inputDirectory: string,
                      src: TileRange,
                      dest: TileRange,
                      copyUpDown? : Direction,
                      inputFilePrefix?: string,
                      outputDirectory?: string, outputFilePrefix?:string) {

        copyUpDown = isUndefined( copyUpDown) ? Direction.NONE : copyUpDown;

        outputDirectory = isUndefined(outputDirectory) ? inputDirectory : outputDirectory;
        inputFilePrefix = isUndefined(inputFilePrefix) ? '' : inputFilePrefix;
        outputFilePrefix = isUndefined(outputFilePrefix) ? inputFilePrefix : outputFilePrefix;

        let commandId : string = Date.now().toString();

        let files: string[] = await af.readdir(inputDirectory);

        let pattern = `^${inputFilePrefix}(\\d+)_(\\d+)_(\\d+).*png$`;
        let regexp = new RegExp( pattern, 'i');

        let stats = { matching:0};

        let tempDir = `${outputDirectory}/temp_${Date.now()}`;
        await Files.ensureOutputDirectoryExists( tempDir);

        console.log( `Copy ${src} -> ${dest} `)

        for (let file of files) {

            let matched = regexp.exec( file);

            if( matched!=null){

                let fileLevel : number = parseInt( matched[1]);
                let fileX : number = parseInt( matched[2]);
                let fileY : number = parseInt( matched[3]);

                if( this.tileInDirectionSet( fileLevel, fileX, fileY, src.level, src.xTileStart, src.yTileStart, src.xTileEnd, src.yTileEnd, copyUpDown) ) {

                    stats.matching+=1;

                    let deltaDestLevelFromSource = dest.level - src.level;
                    let deltaFileLevelFromSource = fileLevel - src.level ;

                    let deltaX: number =  (dest.xTileStart - src.xTileStart ) * (2**deltaFileLevelFromSource);
                    let deltaY: number =  (dest.yTileStart - src.yTileStart ) * (2**deltaFileLevelFromSource);

                    let destLevel = deltaDestLevelFromSource + fileLevel;
                    let destX = fileX+deltaX;
                    let destY = fileY+deltaY;
                    console.log( `${fileLevel} (${fileX},${fileY}) -> ${destLevel} (${destX},${destY})   file=${file} fileLevel=${fileLevel}`);

                    // to avoid overwriting we're going to move twice - we could optimise this to move tiles in a different
                    // order depending on direction of travel, but by renaming to include the filename we would be able to
                    // pickup on a failed move (if that becomes a thing!)
                    //let destFile : string = outputDirectory+`/.command.id_${commandId}.mv.xy_${destX}_${destY}_file_`+file;
                    let inputFile = inputDirectory+'/'+file;
                    let destFile : string = `${outputFilePrefix}${destLevel}_${destX}_${destY}.png`;

                    if( inputDirectory!=outputDirectory){
                        let destPath : string = `${outputDirectory}/${destFile}`;
                        console.log( `Copying ${inputFile} -> ${destPath}`)
                        await Files.copyFile( inputFile, destPath);
                    }
                    else {
                        let tempPath : string = `${tempDir}/${destFile}`;
                       // console.log( `Copying ${inputFile} -> ${tempPath} (same dir so temp first)`)
                        await Files.copyFile( inputFile, tempPath);  // same partition so effectively moving by renaming
                    }

                }
            } else {
                console.log(`Nope ${file}`);
            }



        }
        console.log( `Found ${stats.matching} out of ${files.length} files `);

        // now copy everything from the temp directory back into the main layer directory and delete the temp
        let tempFiles: string[] = await af.readdir(tempDir);
        for( let tempFile of tempFiles ){
           //   console.log( 'About to rename '+`${tempDir}/${tempFile} -> ${outputDirectory}/${tempFile}`)
             await af.rename( `${tempDir}/${tempFile}`, `${outputDirectory}/${tempFile}`);
        }
        await af.rmdir( tempDir);
    }


    private static tileInDirectionSet( fileLevel: number, fileX : number, fileY : number,
                                       level: number, startTileX : number, startTileY : number,
                                       endTileXInclusive : number, endTileYInclusive: number, upDown : Direction) : boolean {

        let levelDifference = Math.abs(fileLevel-level);

        // Rewrite the x and y to be in co-ordinates compatible with provided level and start/end tiles indexes

        if( upDown == Direction.NONE) {
            // don't change anything i.e. everything must match provided level
        } else if( upDown == Direction.UP && fileLevel>=level) {
            fileLevel = level;
            fileX >>= levelDifference;
            fileY >>= levelDifference;
        } else if( upDown == Direction.DOWN && fileLevel<=level) {
            fileLevel = level;
            fileX <<= levelDifference;
            fileY <<= levelDifference;
        } else if( upDown == Direction.UP_AND_DOWN ) {
            throw "Not yet implemented";
         /*   if( fileLevel>level){  // UP
                fileX >>= levelDifference;
                fileY >>= levelDifference;
            } else if( fileLevel<level) {
                fileX <<= levelDifference;
                fileY <<= levelDifference;
            }
            fileLevel = level;*/
        }

        let isInSet = fileLevel==level && fileX>=startTileX && fileY>=startTileY
                && ( fileX<=endTileXInclusive || endTileXInclusive<0)
                && ( fileY<=endTileYInclusive || endTileYInclusive<0);


        return isInSet;
    }

}