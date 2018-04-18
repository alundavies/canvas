import {DownTiler} from "../DownTiler";
import TileRange from "../TileRange";
import {ImageWriter} from "../image-io/ImageWriter";
import LayerProperties from "../LayerProperties";

export default class SimpleDownTiler implements DownTiler
{
    readonly _tileWidth = 256;
    _outputDirectory : string;
    _layerName : string;
    _imageWriter: ImageWriter;

    constructor( outputDirectory: string, layerName: string, imageWriter: ImageWriter){
        this._outputDirectory = outputDirectory;
        this._layerName = layerName;
        this._imageWriter = imageWriter;
    }

    async downTile( layerProperties: LayerProperties, inputTileRange: TileRange) : Promise<TileRange> {

        // Take the provided tileRange and split it into nice chunks of 4, 2x2
        let zStop = inputTileRange.level-Math.ceil( Math.log2( this._tileWidth));  // could we floor this and save a level?

console.log( `Tiling from level = ${inputTileRange.level} down to level = ${zStop}`);

        for( let z=inputTileRange.level; z>zStop && z>0; z--){

            console.log( `\nLevel: ${z} (from level: ${inputTileRange.level})\n inputTileRange             = ${inputTileRange.toString()}`);

            // Adjust the input so that it is aligned to even boundaries, making montage calculations easier
            let zoomFactor = inputTileRange.level-z;
            let sourceTileRange = new TileRange( inputTileRange.level-zoomFactor,
                (inputTileRange.xTileStart>>zoomFactor),
                (inputTileRange.yTileStart>>zoomFactor),
                (inputTileRange.xTileEnd>>zoomFactor),
                (inputTileRange.yTileEnd>>zoomFactor));

            console.log( ` sourceTileRange (adjusted) = ${sourceTileRange.toString()}   zoomFactor = ${zoomFactor}`);

            for( let x=0; x<sourceTileRange.width; x+=1){
                for( let y=0; y<sourceTileRange.height; y+=1){

                    // Calculate destination into which the output of 4 upper tiles should go
                    let subTileStartX = (sourceTileRange.xTileStart+x)>>1; // divide by 2
                    let subTileEndX = (sourceTileRange.xTileEnd+x)>>1;
                    let subTileStartY = (sourceTileRange.yTileStart+y)>>1;
                    let subTileEndY = (sourceTileRange.yTileEnd+y)>>1;
                    let destinationTileRange = new TileRange( z-1, subTileStartX, subTileStartY, subTileEndX, subTileEndY );


console.log( `\nDown Tiler requesting montage for montage tile range`);
console.log( ` sourceTileRange      = ${sourceTileRange}`);
console.log( ` destinationTileRange = ${destinationTileRange.toString()}`);

                    await this._imageWriter.montageTileRangeToSingleTile( layerProperties, sourceTileRange, destinationTileRange);

                    //await new Promise( (resolve) => { setTimeout( function(){ resolve()}, 2000);});
                }
            }
        }
        return inputTileRange;
    }

    alignEven( value : number ) : number {
        return value%2==0 ? value : value-1;
    }
}