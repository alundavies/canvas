/**
 * Created by alundavies on 17/04/2018.
 */
export default class Captured {
    constructor(readonly url: string,
                readonly filename: string,
                readonly path: string,
                readonly type: string) {
    }
}