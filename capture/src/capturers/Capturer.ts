/**
 * Created by alundavies on 17/04/2018.
 */
import Captured from "./Captured";

export interface Capturer {
    capture( url: string, options? : {}) : Promise<Captured>;
}