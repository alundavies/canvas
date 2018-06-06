import { spawn } from 'child_process';
import {isUndefined} from "util";
import {ImageSizeReader} from '../ImageSizeReader';
import TileRange from '../../TileRange';

export default class ImageMagickImageToTiles {

    _imageSizeReader?: ImageSizeReader;

    constructor( imageSizeReader?: ImageSizeReader ){
        this._imageSizeReader = imageSizeReader;
    }

    async tile( imagePath: string, outputDirectory: string,
                outputFilePrefix: string,
                layerNumber: number,
                tileX: number, tileY:number,
                tileWidth:number, tileHeight:number,
                tileXOffset=0, tileYOffset=0,
                imageSize?: ImageSizeProperties) : Promise<TileRange> {

        if( isUndefined( imageSize)){
            if( !isUndefined( this._imageSizeReader)){
                imageSize = await this._imageSizeReader.getSizePropertiesOf( imagePath);
            }
            else{
                throw `Could not establish size of image`;
            }
        }

        const outputPath : string = `${outputDirectory}/${outputFilePrefix}%[filename:tile].png`;

        let imageSizeWithOffsets = {width:imageSize.width+tileXOffset, height:imageSize.height+tileYOffset};

        let fullWidth : number = imageSizeWithOffsets.width % tileWidth > 0 ?
            (Math.trunc( imageSizeWithOffsets.width/tileWidth)+1) * (tileWidth) :
            imageSizeWithOffsets.width;

        let fullHeight : number = imageSizeWithOffsets.height % tileHeight > 0 ?
            (Math.trunc( imageSizeWithOffsets.height/tileHeight)+1) * (tileHeight) :
            imageSizeWithOffsets.height;

console.log( `ImageMagickToTiles - ${fullHeight} x ${fullWidth} -> ${outputPath}`);

        // xc - below is for background, e.g. white/black
        let args = `-size ${fullWidth}x${fullHeight} xc:none ${imagePath} -geometry +${tileXOffset}+${tileYOffset} -composite -crop ${tileWidth}x${tileHeight} -set filename:tile %[fx:page.x/${tileWidth}+${tileX}]_%[fx:page.y/${tileHeight}+${tileY}] +repage +adjoin ${outputPath}`;

        //args = `-size 512x512 xc:white ${imagePath} -composite ${outputDirectory}/test.png`;

        return new Promise<TileRange>( (resolve, reject) => {

            const ls=spawn('convert', args.split(' '));

            ls.stdout.on('data', (data : any) => {
                console.log(`stdout: ${data}`);
            });

            ls.stderr.on('data', (data : any) => {
                console.log(`stderr: ${data}`);
                reject( data);
            });

            ls.on('close', (code : any) => {
//console.log(`Done converting to tiles - exit code: ${code} (zero is good)`);
                resolve( new TileRange( layerNumber, tileX, tileY, fullWidth/tileWidth+tileX-1, fullHeight/tileHeight+tileY-1));
            });

        });
    }
}