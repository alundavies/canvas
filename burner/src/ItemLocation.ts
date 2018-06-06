/**
 * Created by alundavies on 25/04/2018.
 */
export default class ItemLocation {

    constructor( readonly itemId: String,
                 readonly top: number, readonly left: number,
                 readonly bottom : number, readonly right : number,
                 readonly imageWidth: number, readonly imageHeight: number,
                 readonly imageScaleFactor: number){

    }
}