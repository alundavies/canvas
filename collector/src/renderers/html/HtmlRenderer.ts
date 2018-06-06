/**
 * Created by alundavies on 15/04/2018.
 */
import {Renderer} from "../Renderer";
import * as as from "async-file";
import Files from "../../../../burner/src/file-io/Files";

export default class HtmlRenderer implements Renderer{

    templates : any = {};
    fileTypeSettings : any = {}

    constructor( readonly outputDirectory: string) {

    }

    async render( target: string) : Promise<void> {
        let extension : string = target.substring( target.lastIndexOf(".")+1, target.length);

        let templateExtension = extension;

        if( !this.templates[extension]){
            try{
                let template = await as.readTextFile( `${__dirname}/templates/${templateExtension}.html`);
                this.templates[ templateExtension] = template;
            } catch( e){
                templateExtension = 'dafault';
                let template = await as.readTextFile( `${__dirname}/templates/${templateExtension}.html`);
                this.templates[ templateExtension] = template;
            }
        }

        if( !this.fileTypeSettings[ 'default']){
            let settings = JSON.parse( await as.readTextFile( `${__dirname}/templates/default.settings.json`));
            this.fileTypeSettings[ 'default'] = settings;
        }

        if( !this.fileTypeSettings[extension]){
            let settings = { "EMPTY": "EMPTY"};
            try {
                settings = JSON.parse( await as.readTextFile( `${__dirname}/templates/${extension}.settings.json`));
                this.fileTypeSettings[ extension] = settings;
            } catch( e){
                this.fileTypeSettings[ extension] =  this.fileTypeSettings[ 'default']
            }
        }


        let dynamicSettings : { [index:string] : string }  = {
            "__FILE_PATH__": target,
            "__FILE_NAME__": target.substring( target.lastIndexOf("/")+1, target.length),
            "__FILE_TEXT_CONTENTS__": this.templates[ templateExtension] && this.templates[ templateExtension].includes('__FILE_TEXT_CONTENTS__') ? (await as.readTextFile( target)).trim() : '',
            "__FILE_BASE64_CONTENTS__": this.templates[ templateExtension] && this.templates[ templateExtension].includes( '__FILE_BASE64_CONTENTS__') ? new Buffer( await as.readFile( target)).toString( 'base64') : ''
        }

        let settings :  { [index:string] : string } = { ...this.fileTypeSettings[ 'default'], ...this.fileTypeSettings[ extension], ...dynamicSettings} ;

        let newContents : string = this.templates[ templateExtension];
        for( let setting in settings){
            let pattern = new RegExp( setting, 'g');
            newContents = newContents.replace( pattern, settings[setting]);
        }

        let targetDir = target.substring( 0, target.lastIndexOf("/"));
        await Files.ensureOutputDirectoryExists( `${this.outputDirectory}/${targetDir}`);
        await as.writeTextFile( `${this.outputDirectory}/${target}.html`, newContents, 'utf8');
        return;
    }

}