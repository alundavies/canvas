import TileRange from '../../TileRange';
import LayerProperties from "../../LayerProperties";
import * as fs from 'async-file';

export default class ImageMagickTileMontager {

    im : any;

    constructor( im: any) {
        this.im = im;
    }

    async tileMontage( layerProperties: LayerProperties, inputTileRange: TileRange, outputTileRange: TileRange) : Promise<TileRange> {

        if( inputTileRange.level==0){
            throw 'Cannot tile down lower than zero';
        }

        await this.montage( layerProperties, inputTileRange, outputTileRange);

        return outputTileRange;
    }


    async montage ( layerProperties: LayerProperties,
                    inputTileRange: TileRange, outputTileRange: TileRange ) : Promise<TileRange>  {

        let promise = new Promise<TileRange>( async ( resolve, reject)=>{

            let filePathAndPrefix = `${layerProperties.directory}/${layerProperties.layerName}/${layerProperties.filePrefix}`;

            let inFileNames = [
                `${filePathAndPrefix}${inputTileRange.level}_${outputTileRange.xTileStart*2}_${outputTileRange.yTileStart*2}.png`,
                `${filePathAndPrefix}${inputTileRange.level}_${outputTileRange.xTileStart*2+1}_${outputTileRange.yTileStart*2}.png`,
                `${filePathAndPrefix}${inputTileRange.level}_${outputTileRange.xTileStart*2}_${outputTileRange.yTileStart*2+1}.png`,
                `${filePathAndPrefix}${inputTileRange.level}_${outputTileRange.xTileStart*2+1}_${outputTileRange.yTileStart*2+1}.png`
            ];

            console.log( inFileNames);

            let anyExist : boolean = await this.updateFileNamesIfNotExisting( inFileNames);

            let outputFileName: string = `${filePathAndPrefix}${outputTileRange.level}_${outputTileRange.xTileStart}_${outputTileRange.yTileStart}.png`;

            console.log( `Montage output ${outputFileName}`);

            if (await fs.exists(outputFileName)) {
                await fs.delete(outputFileName);
            }

            if( anyExist) {
                this.im(inFileNames[3])
                    //.pointSize(50).fill('red').draw(`text 120, 120 '${zoom}'`)
                    .montage(inFileNames[0])
                    .montage(inFileNames[1])
                    .montage(inFileNames[2])
                    .tile('2x2').gravity("NorthWest").geometry('128x128>+0+0').write(outputFileName,
                    () => {
                        //console.log('Generated Zoomed Out Tile', new Date());
                        resolve( outputTileRange);
                    }
                );
            } else {
                resolve( outputTileRange);
            }
        });

        return promise;
    };

    async updateFileNamesIfNotExisting( fileNames: string[]) : Promise<boolean> {

//console.log( `${__dirname} - when providing blank at ../assets/images/blank-labelled-256x256.png` );

        let count : number = 0;
        for( let filenameIdx in fileNames){

            let exists = await fs.exists( fileNames[filenameIdx]);
            if( !exists){
                //console.log( filenames[filenameIdx], 'does not exist');
                fileNames[filenameIdx]='../assets/images/blank-labelled-256x256.png';
                count+=1;
            }
        }
        return count != fileNames.length;
    }

}