"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GrowingPacker {
    fit(blocks) {
        var n, node, block, len = blocks.length;
        var w = len > 0 ? blocks[0].width : 0;
        var h = len > 0 ? blocks[0].height : 0;
        this.root = { x: 0, y: 0, width: w, height: h };
        for (n = 0; n < len; n++) {
            block = blocks[n];
            if (node = this.findNode(this.root, block.width, block.height))
                block.fit = this.splitNode(node, block.width, block.height);
            else
                block.fit = this.growNode(block.width, block.height);
        }
    }
    findNode(root, w, h) {
        if (root) {
            if (root.used) {
                return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
            }
            else if ((w <= root.width) && (h <= root.height)) {
                return root;
            }
        }
        return null;
    }
    splitNode(node, w, h) {
        node.used = true;
        node.down = { x: node.x, y: node.y + h, width: node.width, height: node.height - h };
        node.right = { x: node.x + w, y: node.y, width: node.width - w, height: h };
        return node;
    }
    growNode(w, h) {
        if (this.root) {
            let canGrowDown = (w <= this.root.width);
            let canGrowRight = (h <= this.root.height);
            let shouldGrowRight = canGrowRight && (this.root.height >= (this.root.width + w)); // attempt to keep square-ish by growing right when height is much greater than width
            let shouldGrowDown = canGrowDown && (this.root.width >= (this.root.height + h)); // attempt to keep square-ish by growing down  when width  is much greater than height
            if (shouldGrowRight)
                return this.growRight(w, h);
            else if (shouldGrowDown)
                return this.growDown(w, h);
            else if (canGrowRight)
                return this.growRight(w, h);
            else if (canGrowDown)
                return this.growDown(w, h);
        }
        return null; // need to ensure sensible root starting size to avoid this happening
    }
    growRight(w, h) {
        if (this.root) {
            this.root = {
                used: true,
                x: 0,
                y: 0,
                width: this.root.width + w,
                height: this.root.height,
                down: this.root,
                right: { x: this.root.width, y: 0, width: w, height: this.root.height }
            };
            var node = this.findNode(this.root, w, h);
            if (node) {
                return this.splitNode(node, w, h);
            }
        }
        return null;
    }
    growDown(w, h) {
        if (this.root) {
            this.root = {
                used: true,
                x: 0,
                y: 0,
                width: this.root.width,
                height: this.root.height + h,
                down: { x: 0, y: this.root.height, width: this.root.width, height: h },
                right: this.root
            };
            let node = this.findNode(this.root, w, h);
            if (node)
                return this.splitNode(node, w, h);
        }
        return null;
    }
}
exports.GrowingPacker = GrowingPacker;
;
//# sourceMappingURL=2d-packer.js.map