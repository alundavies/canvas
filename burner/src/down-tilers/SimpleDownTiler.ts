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

    async downTile( layerProperties: LayerProperties, tileRange: TileRange) : Promise<TileRange> {

        // Take the provided tileRange and split it into nice chunks of 4, 2x2
        let zStart = tileRange.level;

        let zStop = Math.max( 0, zStart-Math.ceil( Math.log2( this._tileWidth)));  // could we floor this and save a level?

        for( let z=zStart; z>zStop; z--){
            for( let x=0; x<tileRange.width; x+=2){
                for( let y=0; y<tileRange.height; y+=2){

                    let subTileStartX = tileRange.xTileStart+x;
                    let subTileEndX = subTileStartX+1;
                    let subTileStartY = tileRange.yTileStart+y;
                    let subTileEndY = subTileStartY+1;

                    tileRange = await this._imageWriter.montageTileRangeToSingleTile( layerProperties,
                        new TileRange( z, subTileStartX, subTileStartY, subTileEndX, subTileEndY ));
                }
            }
        }
        return tileRange;
    }
}