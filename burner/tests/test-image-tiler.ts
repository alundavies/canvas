/**
 * Created by alundavies on 07/04/2018.
 */
import ImageMagickImageToTiles from '../src/image-io/image-magick/ImageMagickImageToTiles';
import ImageMagickImageSizeReader from '../src/image-io/image-magick/ImageMagickImageSizeReader';

async function run(){
    let imageSizeReader =new ImageMagickImageSizeReader();
    let imageMagickImageToTiles = new ImageMagickImageToTiles( imageSizeReader);

    // First we'll generate at 0, 0 tile_0_0
    let props = await imageMagickImageToTiles.tile( './images/square.png', './images/generated_images', 'test1', 0, 0, 256, 256, 0, 0 );
    console.log( props);

    // Then we'll generate at 2, 2 tile_2_2
    props = await imageMagickImageToTiles.tile( './images/red-square.png', './images/generated_images', 'test2', 2, 2, 256, 256, 0, 0 );
    console.log( props);

    // Now try at 10,10 with an image larger than a single tile
    props = await imageMagickImageToTiles.tile( './images/square-300x300.png', './images/generated_images', 'alun_', 10, 10, 256, 256, 0, 0 );
    console.log( props);

    // try with a tile offset
    props = await imageMagickImageToTiles.tile( './images/square-300x300.png', './images/generated_images', 'tile_with_128_offset_', 0, 0, 256, 256, 128, 128 );
    console.log( props);
};

run();