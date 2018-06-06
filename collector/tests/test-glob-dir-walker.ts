/**
 * Created by alundavies on 15/04/2018.
 */
import FileCollector from '../src/collectors/FileCollector'
import {Collector} from "../src/collectors/Collector";

async function run(){
    let fileCollector : Collector = new FileCollector( "/Users/alundavies/git/canvas", "*.ts", {ignore: ["**/node_modules/**"]}, true);
    let files = await fileCollector.collect();
    console.log( files);
}

run();