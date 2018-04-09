/**
 * Created by alundavies on 07/04/2018.
 */

import {ImageWriter} from '../ImageWriter';
import ImageMagickImageToTiles from './ImageMagickImageToTiles';
import TileRange from '../../TileRange';
import * as fs from 'async-file';
import ImageMagickTileMontager from "./ImageMagickTileMontager";
import LayerProperties from "../../LayerProperties";

export default class ImageMagickImageWriter implements ImageWriter {

    _imageMagick : any;
    _imageMagickImageToTiles: ImageMagickImageToTiles;
    _imageMagickTileMontager: ImageMagickTileMontager;

    constructor( imageMagick: any, imageMagickImageToTiles: ImageMagickImageToTiles, imageMagickTileMontager: ImageMagickTileMontager){
        this._imageMagick = imageMagick;  // cast to any, because montage missing in type description
        this._imageMagickImageToTiles =  imageMagickImageToTiles;
        this._imageMagickTileMontager = imageMagickTileMontager;
    }

    async convertImageToTiles( imagePath: string, outputDirectory: string,
                                 outputFilePrefix: string,
                                 layerNumber: number,
                                 tileX: number, tileY: number,
                                 tileWidth: number, tileHeight: number,
                                 tileXOffset=0, tileYOffset=0,
                                 imageSize?: ImageSizeProperties) : Promise<TileRange> {

        await this.ensureOutputDirectoryExists( outputDirectory);

        return await this._imageMagickImageToTiles.tile( imagePath, outputDirectory, outputFilePrefix,
                                        layerNumber,
                                        tileX, tileY, tileWidth, tileHeight, tileXOffset, tileYOffset,
                                        imageSize);

    }

    async montageTileRangeToSingleTile( layerProperties: LayerProperties, inputTileRange: TileRange, outputTileRange: TileRange): Promise<TileRange> {
        await this.ensureOutputDirectoryExists( layerProperties.directory);
        return await this._imageMagickTileMontager.tileMontage( layerProperties, inputTileRange, outputTileRange);
    }

    async ensureOutputDirectoryExists( outputDirectory: string) {
        let exists : boolean = await fs.exists( outputDirectory);
        if( !exists){
            await fs.mkdir( outputDirectory);
        }
    }
}
