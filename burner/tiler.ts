/*
    Tiler - creates tiles of a larger image

// pngcrush lots of files to compressed dir - 10% reduction
 find . -name "*.png" -print0 | xargs -0 -n 1 -P 4 pngcrush -d ../compressed -reduce

 */
const { spawn } = require('child_process');

const inputPath : string = '../capture/images/bbc_sport_x3.png';

const zoomDepth = 10;

const outputPath : string = `../capture/images/tiles/zoom_${zoomDepth}_%[filename:tile].png`;

const tileSize : number = 256;
const offsetX : number = 11;
const offsetY : number = 49;


function burner( inputPath : string, outputPath : string, x : number, y : number) {
    return function () {
        burn(inputPath, outputPath, x * offsetX, y * offsetY);
    }
}

for( let x=0; x<512/offsetX; x++) {
    for( let y=0; y<512/offsetY; y++) {

        setTimeout( burner( inputPath, outputPath, x, y), 35000*(x-0));

    }
}

function burn( inputPath : string, outputPath : string, x : number, y: number) {

    console.log(x, y);
    const args : string = `${inputPath} -crop ${tileSize}x${tileSize} -set filename:tile %[fx:page.x/${tileSize}+${x}]_%[fx:page.y/${tileSize}+${y}] +repage +adjoin ${outputPath}`;

    const ls=spawn('convert', args.split(' '));

    ls.stdout.on('data', (data : any) => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data : any) => {
        console.log(`stderr: ${data}`);
    });

    ls.on('close', (code : any) => {
        console.log(`child process exited with code ${code} x: ${x} y: ${y}`);
    });
}