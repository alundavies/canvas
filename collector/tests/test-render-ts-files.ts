
import {Collector} from "../src/collectors/Collector";
import FileCollector from "../src/collectors/FileCollector";
import HtmlRenderer from "../src/renderers/html/HtmlRenderer";

async function run(){
    let fileCollector : Collector = new FileCollector( "/Users/alundavies/git/canvas");
    let files : string[] = await fileCollector.collect( "**/*.ts", {ignore: ["**/node_modules/**"]});
    let htmlRenderer = new HtmlRenderer( "/Users/alundavies/shadows/canvas");

    for( let file of files) {
        await htmlRenderer.render( file);
    }

    console.log('complete');
};

run();