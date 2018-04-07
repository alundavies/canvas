import {Burner} from '../Burner';
import {ImageSizeReader} from '../image-helpers/ImageSizeReader';

class SimpleBurner implements Burner {

    _tileWidth: number;
    _tileHeight: number;
    _layerName: string;
    _imageSizeReader: ImageSizeReader;

    constructor(imageSizeReader: ImageSizeReader, layerName: string, tileWidth: number, tileHeight: number) {
        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;
        this._layerName = layerName;
        this._imageSizeReader = imageSizeReader;
    }

    /**
     * Fit an image between 0 and 1 x, y coordinates, with a width and height also specified inclusive of 0 and 1 bounds
     * @param x  0<=x<=1
     * @param y  0<=y<=1
     * @param width 0<= x+width<=1
     * @param height 0<= y+height<=1
     * @returns {TileRange} indicating which tiles have been updated as a result of this burn
     */
    async burnImageToFitXY( imagePath: string, x: number, y: number, width: number, height: number) : Promise<TileRange> {
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

        let tileRange:TileRange = await this.burnImageAtLevelXY( imagePath, level, tileX, tileY, 0, 0);

        return tileRange;
    }

    async burnImageAtLevelXY( imagePath: string, level: number, tileX: number, tileY: number, tileOffsetX=0, tileOffset=0) : Promise<TileRange> {

        // let tileEndX = Math.trunc( (x+width) * (2 ** level));
        // let tileEndY = Math.trunc( (y+height) * (2 ** level));

        let promise = new Promise<TileRange>( (resolve, reject) => {
            resolve( new TileRange( 0, 0, 0, 0, 0));
        });
        return promise;

    }

    get tileWidth(){
        return this._tileWidth;
    }

    get tileHeight() {
        return this._tileHeight;
    }
}