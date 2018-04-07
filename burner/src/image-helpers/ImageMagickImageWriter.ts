/**
 * Created by alundavies on 07/04/2018.
 */
import * as gm from 'gm';
import {ImageWriter} from './ImageWriter';

export default class ImageMagickImageWriter implements ImageWriter {

    _imageMagick : any;

    constructor(){
        let imageMagick = gm.subClass({ imageMagick: true });
        this._imageMagick = imageMagick;  // cast to any, because montage missing in type description
    }

    async convertImageToTiles( imagePath: string, outputDirectory: string, outputXYZFormat: string, layerNumber:number,
                                 tileX: number, tileY:number,
                                 tileWidth:number, tileHeight:number,
                                 tileXOffset=0, tileYOffset=0,
                                 imageSize?: ImageSizeProperties) : Promise<TileRange> {

        return new Promise<TileRange>( (resolve, reject) => {
                this._imageMagick(imagePath).ping().size(function (err:any, data:any) {
                    if (!err && data){
                        resolve(data)
                    } else {
                        reject( err);
                    }
            });
            resolve( new TileRange( 0, 0, 0, 0, 0));
        });

    }
}