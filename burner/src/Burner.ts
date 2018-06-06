import TileRange from "./TileRange";
import BurnResult from "./BurnResult";

export interface Burner {
    readonly tileWidth : number;
    readonly tileHeight : number;

    burnImageToFitXY( imagePath: string, x: number, y: number, width: number, height: number) : Promise<BurnResult>;
    burnImageAtLevelXY( imagePath: string, imageSize: ImageSizeProperties, level: number, x: number, y: number, tileOffsetX: number, tileOffsetY: number) : Promise<BurnResult>;
}

