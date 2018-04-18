
import {Collector} from "../src/collectors/Collector";
import FileCollector from "../src/collectors/FileCollector";
import HtmlRenderer from "../src/renderers/html/HtmlRenderer";

async function run(){
    let fileCollector : Collector = new FileCollector( "/Users/alundavies/git/canvas");
    let files : string[] = await fileCollector.collect( "**/*.ts", {ignore: ["**/node_modules/**"]});
    let htmlRenderer = new HtmlRenderer( "/Users/alundavies/shadows/canvas");

    let promises : Promise<void>[] = []
    for( let file of files) {
        promises.push( htmlRenderer.render( file));
    }

    await Promise.all( promises);

    console.log('complete');
};

run();