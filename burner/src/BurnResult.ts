/**
 * Created by alundavies on 25/04/2018.
 */

import ItemLocation from "./ItemLocation";
import TileRange from "./TileRange";

export default class BurnResult {

    constructor( public readonly tileRange: TileRange, readonly itemLocation: ItemLocation){

    }

    toString() : string {
        return `${this.tileRange}`;
    }

}