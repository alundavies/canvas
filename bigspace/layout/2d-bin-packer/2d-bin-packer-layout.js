"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _2d_packer_1 = require("./2d-packer");
const big_space_layout_1 = require("../big-space-layout");
class TwoDimensionalBinPackerLayout extends big_space_layout_1.BigSpaceLayout {
    constructor() {
        super();
        this.packer = new _2d_packer_1.GrowingPacker();
    }
    layout(blocks) {
        blocks = blocks.sort((a, b) => { return b.width - a.width; });
        this.packer.fit(blocks);
    }
}
exports.TwoDimensionalBinPackerLayout = TwoDimensionalBinPackerLayout;
//# sourceMappingURL=2d-bin-packer-layout.js.map