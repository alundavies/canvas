/**
 * Created by alundavies on 06/04/2018.
 */
class TileRange {
    level: number;
    xTileStart: number;
    yTileStart: number;
    xTileEnd: number;
    yTileEnd: number;

    constructor( level: number, xTileStart: number, yTileStart: number, xTileEnd: number, yTileEnd: number) {
        this.level=level;
        this.xTileStart = xTileStart;
        this.yTileStart = yTileStart;
        this.xTileEnd = xTileEnd;
        this.yTileEnd = yTileEnd;
    }

    width() {
        return this.xTileEnd-this.xTileStart+1;
    }

    height() {
        return this.yTileEnd-this.yTileStart+1;
    }
}