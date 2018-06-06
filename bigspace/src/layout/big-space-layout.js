"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BigSpaceLayout {
    layout(blocks) {
    }
    normalise(blocks) {
        // find max and min x, y
        let maxX = 0;
        let maxY = 0;
        for (let block of blocks) {
            if (block.fit) {
                maxX = Math.max(maxX, block.fit.x + block.fit.width);
                maxY = Math.max(maxY, block.fit.y + block.fit.height);
            }
        }
        // Normalise
        maxX = maxY = Math.max(maxX, maxY); // maintain aspect ratio
        for (let block of blocks) {
            if (block.fit) {
                block.fit.x = block.fit.x / maxX;
                block.fit.width = block.fit.width / maxX;
                block.fit.y = block.fit.y / maxY;
                block.fit.height = block.fit.height / maxY;
            }
        }
    }
}
exports.BigSpaceLayout = BigSpaceLayout;
//# sourceMappingURL=big-space-layout.js.map