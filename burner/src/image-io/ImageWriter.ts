/**
 * Created by alundavies on 07/04/2018.
 */

import TileRange from '../TileRange';
import LayerProperties from "../LayerProperties";

export interface ImageWriter {
    convertImageToTiles( imagePath: string, outputDirectory: string,
                         outputFilePrefix: string,
                         layerNumber: number,
                         tileX: number, tileY:number,
                         tileWidth:number, tileHeight:number,
                         tileXOffset?:number, tileYOffset?:number,
                         imageSize?: ImageSizeProperties) : Promise<TileRange>;

    montageTileRangeToSingleTile( layerProperties: LayerProperties, sourceTileRange: TileRange, destinationTileRange: TileRange) : Promise<TileRange>;

}
