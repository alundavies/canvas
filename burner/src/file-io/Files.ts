/**
 * Created by alundavies on 14/04/2018.
 */

import * as fs from 'fs';
import * as as from 'async-file';

import * as Util from 'util'

export default class Files {

    private static copyFileAsync = Util.promisify( fs.copyFile);

    static async ensureOutputDirectoryExists( outputDirectory: string) {
        let exists : boolean = await as.exists( outputDirectory);
        if( !exists){
            await as.mkdirp( outputDirectory);
            console.log( `${outputDirectory} created`)
        }
    }

    static async copyFile( src: string, dest: string){
        await Files.copyFileAsync( src, dest);
    }

    static async writeTextToFile( text: string, destination: string) : Promise<void>{
        return as.writeTextFile( destination, text )
    }

}