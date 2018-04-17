/**
 * Created by alundavies on 06/04/2018.
 */
import {isUndefined} from 'util';

export default class TileRange {
    readonly level: number;
    readonly xTileStart: number;
    readonly yTileStart: number;
    readonly xTileEnd: number;
    readonly yTileEnd: number;

    constructor( level: number, xTileStart: number, yTileStart: number, xTileEnd?: number, yTileEnd?: number) {
        this.level=level;
        this.xTileStart = xTileStart;
        this.yTileStart = yTileStart;
        this.xTileEnd = !isUndefined( xTileEnd) ? xTileEnd : xTileStart;
        this.yTileEnd = !isUndefined( yTileEnd) ? yTileEnd : yTileStart;
    }

    toString() : string {
        return `level: ${this.level}  x: ${this.xTileStart}  y: ${this.yTileStart}  x': ${this.xTileEnd}  y': ${this.yTileEnd}`;
    }

    get width() {
        return this.xTileEnd-this.xTileStart+1;
    }

    get height() {
        return this.yTileEnd-this.yTileStart+1;
    }
}