/**
 * Created by alundavies on 07/04/2018.
 */
import * as gm from 'gm';
import ImageMagickImageToTiles from '../src/image-io/image-magick/ImageMagickImageToTiles';
import ImageMagickImageSizeReader from '../src/image-io/image-magick/ImageMagickImageSizeReader';
import {Burner} from '../src/Burner';
import ImageMagickImageWriter from "../src/image-io/image-magick/ImageMagickImageWriter";
import {ImageWriter} from "../src/image-io/ImageWriter";
import SimpleBurner from "../src/burners/SimpleBurner";
import ImageMagickTileMontager from "../src/image-io/image-magick/ImageMagickTileMontager";
import {DownTiler} from "../src/DownTiler";
import SimpleDownTiler from "../src/down-tilers/SimpleDownTiler";
import LayerProperties from "../src/LayerProperties";
import TileRange from "../src/TileRange";
import {isUndefined} from "util";
import * as rimraf from 'rimraf';

async function run(){

    // clear 'sample' layer directory first
    rimraf.sync( '/Users/alundavies/tiles/layers/sample');

    let imageList : string[] = [
        '/Users/alundavies/Desktop/galaxy.jpg',
        '/Users/alundavies/Desktop/nasa_space.png',
        '/Users/alundavies/Desktop/village.png',
        '/Users/alundavies/Desktop/money_huge.png',
        //'./images/red-square.png',
        './images/square-300x300.png',
        //'./images/red-square.png', './images/square-300x300.png',
        //'./images/square.png', './images/red-square.png', //, '/Users/alundavies/Desktop/space.png'//, './images/square-300x300.png'
    ];

    let imageSizeReader = new ImageMagickImageSizeReader();
    let imageMagickImageToTiles = new ImageMagickImageToTiles( imageSizeReader);
    let imageMagick = gm.subClass({ imageMagick: true });
    let imageMagickTileMontager = new ImageMagickTileMontager( imageMagick);
    let imageWriter : ImageWriter = new ImageMagickImageWriter( imageMagick, imageMagickImageToTiles, imageMagickTileMontager);

    let layerProperties = new LayerProperties( 'sample', 256, 256, '/Users/alundavies/tiles/layers');

    let burner : Burner = new SimpleBurner( imageSizeReader, imageWriter, '/Users/alundavies/tiles/layers', 'sample', 256, 256);

    let downTiler : DownTiler = new SimpleDownTiler( '/Users/alundavies/tiles/layers', 'sample', imageWriter);

    // First we'll generate at 0, 0 tile_0_0
    const entries = 2;

    let allBurnedTileRanges : TileRange[] = [];

    for( let y=0; y<entries; y++){
        for( let x=0; x<entries; x++){
            let burnedTileRange = await burner.burnImageToFitXY( imageList[(y*entries+x)%imageList.length], x/entries, y/entries, 1.0/entries, 1.0/entries);
            allBurnedTileRanges.push( burnedTileRange);
            console.log( `TileRange that burn took place at ${burnedTileRange.toString()}\n`);
        }
    }

    console.log( '\n\nEntering down tiler phase\n');
    if( allBurnedTileRanges.length!=0){
        for( let burnedTileRange of allBurnedTileRanges) {
            await downTiler.downTile( layerProperties, burnedTileRange)
        }
    } else {
        console.log( 'No TileRange provided back from burner - the tiles may not have been generated');
    }

};

run();