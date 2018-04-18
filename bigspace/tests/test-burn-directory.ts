/**
 * Created by alundavies on 18/04/2018.
 */
import * as gm from "gm";
import {Collector} from "../../collector/src/collectors/Collector";
import FileCollector from "../../collector/src/collectors/FileCollector";
import ImageMagickImageToTiles from "../../burner/src/image-io/image-magick/ImageMagickImageToTiles";
import ImageMagickTileMontager from "../../burner/src/image-io/image-magick/ImageMagickTileMontager";
import {ImageWriter} from "../../burner/src/image-io/ImageWriter";
import ImageMagickImageWriter from "../../burner/src/image-io/image-magick/ImageMagickImageWriter";

import LayerProperties from "../../burner/src/LayerProperties";
import SimpleBurner from "../../burner/src/burners/SimpleBurner";
import {Burner} from "../../burner/src/Burner";
import {DownTiler} from "../../burner/src/DownTiler";
import SimpleDownTiler from "../../burner/src/down-tilers/SimpleDownTiler";
import TileRange from "../../burner/src/TileRange";
import ImageMagickImageSizeReader from '../../burner/src/image-io/image-magick/ImageMagickImageSizeReader';
import {rimraf} from "../../burner/node_modules/async-file";


async function run() {

    let fileCollector: Collector = new FileCollector("/Users/alundavies/shadows/canvas");
    let files: string[] = await fileCollector.collect("**/*.png", {ignore: ["**/node_modules/**"]});

    console.log(files);
    let promises: Promise<string>[] = [];

    // now put all those pngs in square
    let entries: number = Math.sqrt(files.length)+1;
    //entries = 2;

    // clear 'sample' layer directory first
    await rimraf('/Users/alundavies/tiles/layers/code');

    let imageSizeReader = new ImageMagickImageSizeReader();
    let imageMagickImageToTiles = new ImageMagickImageToTiles(imageSizeReader);
    let imageMagick = gm.subClass({imageMagick: true});
    let imageMagickTileMontager = new ImageMagickTileMontager(imageMagick);
    let imageWriter: ImageWriter = new ImageMagickImageWriter(imageMagick, imageMagickImageToTiles, imageMagickTileMontager);

    let layerProperties = new LayerProperties('code', 256, 256, '/Users/alundavies/tiles/layers');

    let burner: Burner = new SimpleBurner(imageSizeReader, imageWriter, '/Users/alundavies/tiles/layers', 'code', 256, 256);

    let downTiler: DownTiler = new SimpleDownTiler('/Users/alundavies/tiles/layers', 'code', imageWriter);

    // First we'll generate at 0, 0 tile_0_0

    let allBurnedTileRanges: TileRange[] = [];

    for (let y = 0; y < entries; y++) {
        for (let x = 0; x < entries; x++) {
            let offset  = (y * entries + x)//+14;

         //   if(( y==1 && x==0) || (y==0 && x==1)) continue;

            if ( offset < files.length) {
                let burnedTileRange = await burner.burnImageToFitXY(files[offset], x / entries, y / entries, 1.0 / entries, 1.0 / entries);
                allBurnedTileRanges.push(burnedTileRange);
                console.log(`TileRange that burn took place at ${burnedTileRange.toString()}\n`);
            }
        }
    }

    console.log('\n\nEntering down tiler phase\n');
    if (allBurnedTileRanges.length != 0) {
        allBurnedTileRanges.sort( (a,b) => {
            return b.level-a.level;
        })
        for (let burnedTileRange of allBurnedTileRanges) {
            console.log( `${burnedTileRange}`)
            await downTiler.downTile(layerProperties, burnedTileRange)
        }
    } else {
        console.log('No TileRange provided back from burner - the tiles may not have been generated');
    }

    for (let burnedTileRange of allBurnedTileRanges) {
        console.log( `${burnedTileRange}`)
    }
};

run();