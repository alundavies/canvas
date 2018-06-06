/**
 * Created by alundavies on 15/04/2018.
 */
export interface Collector {
    collect() : Promise<string[]>;
}