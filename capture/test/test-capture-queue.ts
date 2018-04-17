import CaptureQueue from "../src/CaptureQueue";

async function run() :  Promise<void>{
    let captureQueue : CaptureQueue = new CaptureQueue();

    let allPromises : Promise<string>[] = [];

    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));
    allPromises.push(captureQueue.capture( "http://new.bbc.co.uk"));

    console.log( 'Awaiting all promises');
    await Promise.all( allPromises);
    console.log( 'AllPromises complete');

};

run();