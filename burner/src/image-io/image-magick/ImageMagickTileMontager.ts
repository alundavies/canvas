import TileRange from '../../TileRange';
import LayerProperties from "../../LayerProperties";
import * as fs from 'async-file';
import * as path from "path";

export default class ImageMagickTileMontager {

    im : any;
    private readonly blankImagePath:string;


    constructor( im: any) {
        this.im = im;

        //this.blankImagePath = path.join( __dirname, '../../../assets/images/blank-labelled-256x256.png');
        //this.blankImagePath = path.join( __dirname, '../../../assets/images/blank-transparent-1x1.png');
        this.blankImagePath = path.join( __dirname, '../../../assets/images/blank-transparent-256x256.png');

        if( !fs.exists( this.blankImagePath)){
            throw `Not happening - can't find blank image at '${this.blankImagePath}'`;
        }
    }

    async tileMontage( layerProperties: LayerProperties, outputTileRange: TileRange) : Promise<TileRange> {

        if( outputTileRange.level<0){
            throw 'Cannot tile down lower than zero';
        }

        await this.montage( layerProperties, outputTileRange);

        return outputTileRange;
    }


    async montage ( layerProperties: LayerProperties, outputTileRange: TileRange ) : Promise<TileRange>  {

        let promise = new Promise<TileRange>( async ( resolve, reject)=>{

            let filePathAndPrefix = `${layerProperties.directory}/${layerProperties.layerName}/${layerProperties.filePrefix}`;

            let inFileNames = [
                `${filePathAndPrefix}${outputTileRange.level+1}_${outputTileRange.xTileStart*2}_${outputTileRange.yTileStart*2}.png`,
                `${filePathAndPrefix}${outputTileRange.level+1}_${outputTileRange.xTileStart*2+1}_${outputTileRange.yTileStart*2}.png`,
                `${filePathAndPrefix}${outputTileRange.level+1}_${outputTileRange.xTileStart*2}_${outputTileRange.yTileStart*2+1}.png`,
                `${filePathAndPrefix}${outputTileRange.level+1}_${outputTileRange.xTileStart*2+1}_${outputTileRange.yTileStart*2+1}.png`
            ];

           // console.log( inFileNames);

            let anyExist : boolean = await this.updateFileNamesIfNotExisting( inFileNames);

            let outputFileName: string = `${filePathAndPrefix}${outputTileRange.level}_${outputTileRange.xTileStart}_${outputTileRange.yTileStart}.png`;

            console.log( `Montage output ${outputFileName}`);

            if (await fs.exists(outputFileName)) {
                console.log( `Deleting ${outputFileName}`)
                await fs.delete(outputFileName);
            }

            if( anyExist) {
                this.im(inFileNames[3])
                    //.pointSize(50).fill('red').draw(`text 120, 120 '${zoom}'`)
                    .montage(inFileNames[0])
                    .montage(inFileNames[1])
                    .montage(inFileNames[2])
                    .tile('2x2')
                 //   .set('option:filter:lobes 8')
                    .gravity("NorthWest")
                    .geometry('128x128>+0+0')
                    .background('none').write(outputFileName,
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
                fileNames[filenameIdx]=this.blankImagePath;
                count+=1;
            }
        }
        return count != fileNames.length;
    }

}