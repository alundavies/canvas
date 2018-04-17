import * as Queue from 'promise-queue';

export default class CaptureQueue {

    queue : Queue = new Queue( 5, Infinity);
    itemCount : number = 0;

    async capture( url : string, options? : any) : Promise<string> {

        return new Promise<string>( (resolve, reject) => {
            this.queue.add( () => {
                return new Promise( async (queuedResolve, queuedReject) => {
                    this.itemCount++;
                    console.log( `Processing item ${url}`);

                    await capture
                    queuedResolve()
                }).then( function(){
                    resolve( url);
                });
            });
        });

    }
}


