/**
 * Created by alundavies on 07/04/2018.
 */
export interface ImageWriter {
    convertImageToTiles( imagePath: string,  outputDirectory: string, outputXYZFormat: string, layerNumber:number,
                         tileX: number, tileY:number,
                         tileWidth:number, tileHeight:number,
                         tileXOffset?:number, tileYOffset?:number,
                         imageSize?: ImageSizeProperties) : Promise<TileRange>;

}
