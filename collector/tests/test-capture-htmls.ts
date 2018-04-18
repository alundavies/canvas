/**
 * Created by alundavies on 18/04/2018.
 */
import {Collector} from "../src/collectors/Collector";
import FileCollector from "../src/collectors/FileCollector";
import CaptureQueue from "../../capture/src/CaptureQueue";

async function run(){
    let fileCollector : Collector = new FileCollector( "/Users/alundavies/shadows/canvas");
    let files : string[] = await fileCollector.collect( "**/*.html", {ignore: ["**/node_modules/**"]});
    let captureQueue : CaptureQueue = new CaptureQueue();
    console.log( files);

    let promises : Promise<string>[] = []
    for( let file of files) {
        promises.push( captureQueue.capture( `file://${file}`, { filePath: `${file}.png`}) );
    }

    await Promise.all( promises);

    console.log('complete');
}

run();