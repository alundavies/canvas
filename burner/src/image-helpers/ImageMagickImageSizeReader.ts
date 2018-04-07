import * as gm from 'gm';
import {ImageSizeReader} from './ImageSizeReader';

export default class ImageMagickImagePropertiesReader implements ImageSizeReader {

    _imageMagick : any;

    constructor(){
        this._imageMagick = gm.subClass({ imageMagick: true });   // cast to any, because montage missing in type description
    }

    async getSizePropertiesOf( imagePath: string) : Promise<ImageSizeProperties> {

        const promise = new Promise<ImageSizeProperties>( (resolve, reject) => {
            this._imageMagick(imagePath).ping().size(function (err:any, data:any) {
                if (!err && data){
                    resolve(data)
                } else {
                    reject( err);
                }
            });
        });

        return promise;
    }
}

/*
 Full example:

 { Format: 'PNG (Portable Network Graphics)',
 format: 'PNG',
 Class: 'DirectClass',
 Geometry: '1154x1295+0+0',
 size: { width: 1154, height: 1295 },
 Units: 'Undefined',
 Type: 'TrueColorAlpha',
 Endianess: 'Undefined',
 Colorspace: 'sRGB',
 Depth: '8-bit',
 depth: 8,
 'Channel depth': { red: '8-bit', green: '8-bit', blue: '8-bit', alpha: '1-bit' },
 'Channel statistics':
 { Red:
 { min: '0 (0)',
 max: '255 (1)',
 mean: '207.712 (0.814556)',
 'standard deviation': '81.165 (0.318294)',
 kurtosis: '0.44561',
 skewness: '-1.43445' },
 Green:
 { min: '0 (0)',
 max: '255 (1)',
 mean: '203.424 (0.797743)',
 'standard deviation': '81.3661 (0.319083)',
 kurtosis: '0.0961365',
 skewness: '-1.30578' },
 Blue:
 { min: '0 (0)',
 max: '255 (1)',
 mean: '191.418 (0.750659)',
 'standard deviation': '90.0469 (0.353125)',
 kurtosis: '-0.95103',
 skewness: '-0.902621' },
 Alpha:
 { min: '255 (1)',
 max: '255 (1)',
 mean: '255 (1)',
 'standard deviation': '0 (0)',
 kurtosis: '0',
 skewness: '0' } },
 'Image statistics':
 { Overall:
 { min: '0 (0)',
 max: '255 (1)',
 mean: '150.639 (0.590739)',
 'standard deviation': '73.0011 (0.286279)',
 kurtosis: '4.44047',
 skewness: '-1.27147' } },
 'Rendering intent': 'Perceptual',
 Gamma: '0.454545',
 Chromaticity:
 { 'red primary': '(0.64,0.33)',
 'green primary': '(0.3,0.6)',
 'blue primary': '(0.15,0.06)',
 'white point': '(0.3127,0.329)' },
 'Background color': 'white',
 'Border color': 'srgba(223,223,223,1)',
 'Matte color': 'grey74',
 'Transparent color': 'none',
 Interlace: 'None',
 Intensity: 'Undefined',
 Compose: 'Over',
 'Page geometry': '1154x1295+0+0',
 Dispose: 'Undefined',
 Iterations: '0',
 Compression: 'Zip',
 Orientation: 'Undefined',
 Properties:
 { 'date:create': '2017-06-10T18:20:29+08:00',
 'date:modify': '2017-06-10T18:20:29+08:00',
 'png:IHDR.bit-depth-orig': '8',
 'png:IHDR.bit_depth': '8',
 'png:IHDR.color-type-orig': '6',
 'png:IHDR.color_type': '6 (RGBA)',
 'png:IHDR.interlace_method': '0 (Not interlaced)',
 'png:IHDR.width,height': '1154, 1295',
 'png:sRGB': 'intent=0 (Perceptual Intent)',
 signature: 'bda638d9fa3625cfc36316a52ea9749f8d1dd717fcc69eeb241762777d91eeec' },
 Artifacts:
 { filename: '/Users/alundavies/tiles/image_sources/bbc_sport.png',
 verbose: 'true' },
 Tainted: 'False',
 Filesize: '919KB',
 'Number pixels': '1.494M',
 'Pixels per second': '29.89MB',
 'User time': '0.050u',
 'Elapsed time': '0:01.050',
 Version: 'ImageMagick 6.8.6-3 2013-07-06 Q16 http://www.imagemagick.org',
 path: '/Users/alundavies/tiles/image_sources/bbc_sport.png' }


 */
