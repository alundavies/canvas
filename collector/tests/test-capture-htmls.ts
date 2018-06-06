/**
 * Created by alundavies on 18/04/2018.
 */
import {Collector} from "../src/collectors/Collector";
import FileCollector from "../src/collectors/FileCollector";
import CaptureQueue from "../../capture/src/CaptureQueue";

async function run(){
    let fileCollector : Collector = new FileCollector( "/Users/alundavies/shadows/canvas", "*.html", { ignore: ["**/node_modules/**"] }, true);
    let files : string[] = await fileCollector.collect();
    let captureQueue : CaptureQueue = new CaptureQueue(10);
    console.log( files);

    console.time( 'Capturing')
    let promises : Promise<string>[] = []
    for( let file of files) {
        promises.push( captureQueue.capture( `file://${file}`, { filePath: `${file}`}) );
    }

    await Promise.all( promises);
    console.timeEnd( 'Capturing')
    console.log('complete');
}

run();