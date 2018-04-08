import TileRange from "./TileRange";

export interface Burner {
    readonly tileWidth : number;
    readonly tileHeight : number;

    burnImageToFitXY( imagePath: string, x: number, y: number, width: number, height: number) : Promise<TileRange>;
    burnImageAtLevelXY( imagePath: string, level: number, x: number, y: number, tileOffsetX: number, tileOffsetY: number) : Promise<TileRange>;
}

