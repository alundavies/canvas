/**
 * Created by alundavies on 15/04/2018.
 */
import {Renderer} from "../Renderer";
import * as as from "async-file";
import Files from "../../../../burner/src/file-io/Files";

export default class HtmlRenderer implements Renderer{

    templates : any = {};

    constructor( readonly outputDirectory: string) {

    }

    async render( target: string) : Promise<void> {
        let extension : string = target.substring( target.lastIndexOf(".")+1, target.length);
        if( !this.templates[extension]){
            let template = await as.readTextFile( `${__dirname}/templates/${extension}.html`);
            this.templates[ extension] = template;
        }

        let newContents= this.templates[ extension].replace( /__FILE_NAME__/g, target.substring( target.lastIndexOf("/")+1, target.length))
        let targetFileContents = await as.readTextFile( target);
        targetFileContents = targetFileContents.trim();
        newContents = newContents.replace( /__FILE_CONTENTS__/g, targetFileContents);
        let targetDir = target.substring( 0, target.lastIndexOf("/"));
        await Files.ensureOutputDirectoryExists( `${this.outputDirectory}/${targetDir}`);
        await as.writeTextFile( `${this.outputDirectory}/${target}.html`, newContents, 'utf8');
        return;
    }

}