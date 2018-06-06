import {Burner} from '../Burner';
import {ImageSizeReader} from '../image-io/ImageSizeReader';
import {ImageWriter} from '../image-io/ImageWriter';
import TileRange from '../TileRange';
import ItemLocation from "../ItemLocation";
import BurnResult from "../BurnResult";
import {isUndefined} from "util";

export default class SimpleBurner implements Burner {

    _tileWidth: number;
    _tileHeight: number;
    _layerName: string;
    _outputDirectory: string;
    _imageSizeReader: ImageSizeReader;
    _imageWriter: ImageWriter;

    constructor( imageSizeReader: ImageSizeReader, imageWriter: ImageWriter, outputDirectory: string, layerName: string, tileWidth: number, tileHeight: number) {
        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;
        this._outputDirectory = outputDirectory;
        this._layerName = layerName;
        this._imageSizeReader = imageSizeReader;
        this._imageWriter = imageWriter;
    }

    /**
     * Fit an image between 0 and 1 x, y coordinates, with a width and height also specified inclusive of 0 and 1 bounds
     * @param x  0<=x<=1
     * @param y  0<=y<=1
     * @param width 0<= x+width<=1
     * @param height 0<= y+height<=1
     * @returns {TileRange} indicating which tiles have been updated as a result of this burn
     */
    async burnImageToFitXY( imagePath: string, x: number, y: number, width: number, height: number) : Promise<BurnResult> {
        let props = await this._imageSizeReader.getSizePropertiesOf( imagePath);
        let imageWidth = props.width;
        let imageHeight = props.height;

        // First find the level at which we must burn the image
        // Our level must offer sufficient space between x and x+width, to accommodate image width
        // based on our default tile width, and the same for y and y+height too
        let xLevel = Math.ceil( Math.log2( imageWidth/( this._tileWidth * width)));
        let yLevel = Math.ceil( Math.log2( imageHeight/( this._tileHeight * height)));

        let level = Math.max( xLevel, yLevel);

        // 2^level is the number of available tiles in that direction, x and y are simply percentage value along that
        let tileX = Math.trunc( x * (2 ** level));
        let tileY = Math.trunc( y * (2 ** level));
console.log( `Burning at level: ${level}`)
        let burnResult = await this.burnImageAtLevelXY( imagePath, props, level, tileX, tileY, 0, 0);
console.log( `Done burning at ${burnResult.toString()}`);
        return burnResult;
    }

    async burnImageAtLevelXY( imagePath: string, imageSize: ImageSizeProperties, level: number, tileX: number, tileY: number, tileXOffset=0, tileYOffset=0) : Promise<BurnResult> {

        // let tileEndX = Math.trunc( (x+width) * (2 ** level));
        // let tileEndY = Math.trunc( (y+height) * (2 ** level));

        // we're going to start with the cheap mans burn approach, of just constructing tiles for this image without
        // any concern for content on neighbouring tiles or overlapping
        if ( isUndefined(imageSize)) {
            imageSize = await this._imageSizeReader.getSizePropertiesOf(imagePath);
        }

        let outputTileRange = await this._imageWriter.convertImageToTiles( imagePath, `${this._outputDirectory}/${this._layerName}`,
            `${level}_`,   // here's the cheap n' nasty bit
            level,
            tileX, tileY,
            this._tileWidth, this._tileHeight,
            tileXOffset, tileYOffset, imageSize);

        let normalisedTop =  (tileY*this._tileHeight+tileYOffset)/( (2**level)*this._tileHeight);
        let normalisedLeft = (tileX*this._tileWidth+tileXOffset)/( (2**level)*this._tileWidth);
        let normalisedBottom = (tileY*this._tileHeight+tileYOffset+imageSize.height)/( (2**level)*this._tileHeight);
        let normalisedRight = (tileX*this._tileWidth+tileXOffset+imageSize.width)/( (2**level)*this._tileWidth);

        let itemLocation = new ItemLocation( imagePath, normalisedTop, normalisedLeft, normalisedBottom, normalisedRight, imageSize.width, imageSize.height, 2 );
        let tileRange = new TileRange( level, tileX, tileY, outputTileRange.xTileEnd, outputTileRange.yTileEnd);

        return new BurnResult( tileRange, itemLocation);
    }

    get tileWidth(){
        return this._tileWidth;
    }

    get tileHeight() {
        return this._tileHeight;
    }
}