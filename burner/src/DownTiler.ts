import TileRange from "./TileRange";
import LayerProperties from "./LayerProperties";
/**
 * Created by alundavies on 08/04/2018.
 */

export interface DownTiler {
    downTile( layerProperties: LayerProperties, tileRange: TileRange) : Promise<TileRange>
}
