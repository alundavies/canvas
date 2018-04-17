import {Collector} from "./Collector";
/**
 * Created by alundavies on 15/04/2018.
 */
import {isUndefined} from 'util';
import * as glob from 'glob';

export default class FileCollector implements Collector {


    constructor( readonly target: string, readonly recursive?: boolean){

        this.recursive = isUndefined( recursive) ? false : true;
    }

    async collect( pattern : string, options?: any): Promise<string[]> {

        let promise : Promise<string[]> = new Promise( (resolve, reject) => {

            glob( `${this.target}/${pattern}`, options, function( err, files){
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