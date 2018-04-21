import * as Queue from 'promise-queue';
import ChromePuppeteerCapturer from "./capturers/chrome-puppeteer/ChromePuppeteerCapturer";
import {Capturer} from "./capturers/Capturer";

export default class CaptureQueue {

    queue : Queue = new Queue( 10, Infinity);
    chromePuppeteerCapturer : Capturer = new ChromePuppeteerCapturer();

    async capture( url : string, options? : any) : Promise<string> {

        return new Promise<string>( (resolve, reject) => {
            this.queue.add( () => {
                return new Promise( async (queuedResolve, queuedReject) => {

                    console.log( `Processing item ${url}`);

                    await this.chromePuppeteerCapturer.capture( url, options);
                    queuedResolve()
                }).then( function(){
                    resolve( url);
                });
            });
        });

    }
}


