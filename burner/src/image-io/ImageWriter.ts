/**
 * Created by alundavies on 07/04/2018.
 */

import TileRange from '../TileRange';
import LayerProperties from "../LayerProperties";

export interface ImageWriter {
    convertImageToTiles( imagePath: string, outputDirectory: string,
                         outputFilePrefix: string,
                         tileX: number, tileY:number,
                         tileWidth:number, tileHeight:number,
                         tileXOffset?:number, tileYOffset?:number,
                         imageSize?: ImageSizeProperties) : Promise<TileRange>;

    montageTileRangeToSingleTile( layerProperties: LayerProperties, tileRange: TileRange) : Promise<TileRange>;

}
