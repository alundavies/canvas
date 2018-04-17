// Simply move tiles from one location to another with possible rename
import * as gm from 'gm';

import ImageMagickImageSizeReader from '../src/image-io/image-magick/ImageMagickImageSizeReader';
import TileFileCopier from "../src/layer-management/TileFileCopier";
import {Direction} from "../src/Direction";
import TileRange from "../src/TileRange";
import SimpleDownTiler from "../src/down-tilers/SimpleDownTiler";
import {DownTiler} from "../src/DownTiler";
import ImageMagickImageToTiles from "../src/image-io/image-magick/ImageMagickImageToTiles";
import ImageMagickTileMontager from "../src/image-io/image-magick/ImageMagickTileMontager";
import ImageMagickImageWriter from "../src/image-io/image-magick/ImageMagickImageWriter";
import {ImageWriter} from "../src/image-io/ImageWriter";
import LayerProperties from "../src/LayerProperties";

//TileFileCopier.copy( '/Users/alundavies/tiles/layers/small', new TileRange( 1, 1, 0), new TileRange( 2,1,3), Direction.UP);
//TileFileCopier.copy( '/Users/alundavies/tiles/layers/small', new TileRange( 1, 1, 0), new TileRange( 2,1,3), Direction.UP);
//TileFileCopier.copy( '/Users/alundavies/tiles/layers/small', new TileRange( 1, 0, 0), new TileRange( 2,3,3), Direction.UP);
//TileFileCopier.copy( '/Users/alundavies/tiles/layers/small', new TileRange( 1, 0, 0), new TileRange( 2,3,1), Direction.UP);

//TileFileCopier.copy( '/Users/alundavies/tiles/layers/small', new TileRange( 1, 1, 0), new TileRange( 5,31,15), Direction.UP);



let imageSizeReader = new ImageMagickImageSizeReader();
let imageMagickImageToTiles = new ImageMagickImageToTiles( imageSizeReader);
let imageMagick = gm.subClass({ imageMagick: true });
let imageMagickTileMontager = new ImageMagickTileMontager( imageMagick);
let imageWriter : ImageWriter = new ImageMagickImageWriter( imageMagick, imageMagickImageToTiles, imageMagickTileMontager);
let downTiler : DownTiler = new SimpleDownTiler( '/Users/alundavies/tiles/layers', 'sample', imageWriter);

async function run(){
    let layerProperties : LayerProperties = new LayerProperties( 'small', 256, 256, '/Users/alundavies/tiles/layers' );
    let burnedTileRange : TileRange = new TileRange( 2, 0, 0, 4, 4);
    await downTiler.downTile( layerProperties, burnedTileRange);
}

run();
/*inputDirectory: string,
    level: number,
    startTileX?: number, startTileY?: number,
    endTileXInclusive?: number, endTileYInclusive?: number,
    copyUpDown? : Direction,
    destinationLevel? : number,
    destinationTileX? : number, destinationTileY?: number,
    inputFilePrefix?: string,
    outputDirectory?: string, outputFilePrefix?:string
);*/

