"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Tiler - creates tiles of a larger image - this actual code does this repeatedly to create many instances of the
    same tiles for experimenting with open layers

// pngcrush lots of files to compressed dir - 10% reduction
 find . -name "*.png" -print0 | xargs -0 -n 1 -P 4 pngcrush -d ../compressed -reduce

 */
const child_process_1 = require("child_process");
const inputPath = '../capture/images/bbc_sport_x3.png';
const zoomDepth = 10;
const outputPath = `../capture/images/tiles/zoom_${zoomDepth}_%[filename:tile].png`;
const tileSize = 256;
const offsetX = 11;
const offsetY = 49;
function burner(inputPath, outputPath, x, y) {
    return function () {
        burn(inputPath, outputPath, x * offsetX, y * offsetY);
    };
}
for (let x = 0; x < 512 / offsetX; x++) {
    for (let y = 0; y < 512 / offsetY; y++) {
        setTimeout(burner(inputPath, outputPath, x, y), 35000 * (x - 0));
    }
}
function burn(inputPath, outputPath, x, y) {
    console.log(x, y);
    const args = `${inputPath} -crop ${tileSize}x${tileSize} -set filename:tile %[fx:page.x/${tileSize}+${x}]_%[fx:page.y/${tileSize}+${y}] +repage +adjoin ${outputPath}`;
    const ls = child_process_1.spawn('convert', args.split(' '));
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code} x: ${x} y: ${y}`);
    });
}
//# sourceMappingURL=tiler.js.map