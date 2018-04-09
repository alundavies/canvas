import {isNumber, isUndefined} from "util";
/**
 * Created by alundavies on 08/04/2018.
 */

export default class LayerProperties {

    readonly layerName : string;
    readonly tileSizeX : number;
    readonly tileSizeY : number;
    readonly transparent : boolean;

    readonly directory : string;
    readonly filePrefix : string;

    // These will be used to specify a layer can be relative to another
    readonly parentLayer: LayerProperties;
    readonly layerOffsetX: number;
    readonly layerOffsetY: number;

    constructor( layerName: string, tileSizeX: number, tileSizeY: number,
                 directory: string, filePrefix?: string,
                 transparent?: boolean,
                 parentLayer?: LayerProperties,
                 layerOffsetX?: number,
                 layerOffsetY?: number ) {

        this.layerName = layerName;
        this.tileSizeX = tileSizeX;
        this.tileSizeY = tileSizeY;
        this.directory = directory;

        if( !isUndefined( filePrefix)){
            this.filePrefix = filePrefix;
        } else {
            this.filePrefix = '';
        }

        this.transparent = isUndefined( transparent) ? true : transparent;

        if( !isUndefined( parentLayer)){
            this.parentLayer = parentLayer;
        }

        if( !isUndefined( layerOffsetX) && isNumber( layerOffsetX)){
            this.layerOffsetX=layerOffsetX;
        } else {
            this.layerOffsetX = 0;
        }

        if( !isUndefined( layerOffsetY) && isNumber(layerOffsetY)){
            this.layerOffsetY = layerOffsetY;
        } else {
            this.layerOffsetY = 0;
        }
    }
}
