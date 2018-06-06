import {Collector} from "./Collector";
/**
 * Created by alundavies on 15/04/2018.
 */
import {isUndefined} from 'util';
import * as glob from 'glob';
import * as as from 'async-file';
import Files from "../../../burner/src/file-io/Files";

export default class FileCollector implements Collector {

    constructor( readonly target: string, readonly include: string, readonly options: any={}, readonly recursive: boolean=false){

    }

    async collect(): Promise<string[]> {

        let promise : Promise<string[]> = new Promise( (resolve, reject) => {

            glob( `${this.target}/${ this.recursive?'**/':''}${this.include}`, this.options, function( err, files){
                if( err){
                    reject( err);
                }
                else {
                    resolve( files);
                }
            });
        });
        return promise;
    }

}