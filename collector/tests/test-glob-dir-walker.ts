/**
 * Created by alundavies on 15/04/2018.
 */
import FileCollector from '../src/collectors/FileCollector'
import {Collector} from "../src/collectors/Collector";

async function run(){
    let fileCollector : Collector = new FileCollector( "/Users/alundavies/git/canvas");
    let files = await fileCollector.collect( "**/*.ts", {ignore: ["**/node_modules/**"]});
    console.log( files);
}

run();