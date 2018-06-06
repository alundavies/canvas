
import {Collector} from "../src/collectors/Collector";
import FileCollector from "../src/collectors/FileCollector";
import HtmlRenderer from "../src/renderers/html/HtmlRenderer";
import * as as from 'async-file';

async function run(){

    let shadowDirectory = "/Users/alundavies/shadows/canvas";

    if( await as.exists( shadowDirectory)){
        await as.rimraf( shadowDirectory);
    }

    let patterns = [ "*.ts", "*.java", "*.png"];
    console.time('RenderToHTML');
    for( let pattern of patterns){

        let fileCollector : Collector = new FileCollector( "/Users/alundavies/git/canvas", pattern, {ignore: ["**/node_modules/**", "**/mxgraph/**"]}, true);
        let files : string[] = await fileCollector.collect();
        let htmlRenderer = new HtmlRenderer( shadowDirectory);
    console.log( files);
        let promises : Promise<void>[] = []
        for( let file of files) {
            promises.push( htmlRenderer.render( file));
        }

        await Promise.all( promises);
    }

    console.timeEnd('RenderToHTML');
};

run();