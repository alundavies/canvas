/**
 * Created by alundavies on 17/04/2018.
 */
import {Capturer} from "../Capturer";

export default class ChomePuppeteerCapturer implements Capturer {
    capture(url: string, options?: {}): Promise<Captured> {
        return undefined;
    }

}