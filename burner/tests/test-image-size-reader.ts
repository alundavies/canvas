/**
 * Created by alundavies on 06/04/2018.
 */
import ImageMagickImageSizeReader from '../src/image-io/image-magick/ImageMagickImageSizeReader';

async function run(){
    let imageMagickImageSizeReader = new ImageMagickImageSizeReader();
    let props = await imageMagickImageSizeReader.getSizePropertiesOf( '/Users/alundavies/git/canvas/capture/images/defaults/blank.png');
    console.log( props);
};

run();
