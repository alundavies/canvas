/******************************************************************************

 This is a binary tree based bin packing algorithm that is more complex than
 the simple Packer (packer.js). Instead of starting off with a fixed width and
 height, it starts with the width and height of the first block passed and then
 grows as necessary to accomodate each subsequent block. As it grows it attempts
 to maintain a roughly square ratio by making 'smart' choices about whether to
 grow right or down.

 When growing, the algorithm can only grow to the right OR down. Therefore, if
 the new block is BOTH wider and taller than the current target then it will be
 rejected. This makes it very important to initialize with a sensible starting
 width and height. If you are providing sorted input (largest first) then this
 will not be an issue.

 A potential way to solve this limitation would be to allow growth in BOTH
 directions at once, but this requires maintaining a more complex tree
 with 3 children (down, right and center) and that complexity can be avoided
 by simply chosing a sensible starting block.

 Best results occur when the input blocks are sorted by height, or even better
 when sorted by max(width,height).

 Inputs:
 ------

 blocks: array of any objects that have .w and .h attributes

 Outputs:
 -------

 marks each block that fits with a .fit attribute pointing to a
 node with .x and .y coordinates

 Example:
 -------

 var blocks = [
 { w: 100, h: 100 },
 { w: 100, h: 100 },
 { w:  80, h:  80 },
 { w:  80, h:  80 },
 etc
 etc
 ];

 var packer = new GrowingPacker();
 packer.fit(blocks);

 for(var n = 0 ; n < blocks.length ; n++) {
    var block = blocks[n];
    if (block.fit) {
      Draw(block.fit.x, block.fit.y, block.w, block.h);
    }
  }


 ******************************************************************************/
interface Node {
    x: number;
    y: number;
    width: number;
    height: number;
    used?: boolean;
    right?: Node;
    down?: Node;
}

interface Block {
    width: number;
    height: number;
    fit? : any;
}

class GrowingPacker {

    root : Node | null;

    fit (blocks : Block[]) : void {
        var n, node, block, len = blocks.length;
        var w : number = len > 0 ? blocks[0].width : 0;
        var h : number = len > 0 ? blocks[0].height : 0;
        this.root = {x: 0, y: 0, width: w, height: h};
        for (n = 0; n < len; n++) {
            block = blocks[n];
            if (node = this.findNode(this.root, block.width, block.height))
                block.fit = this.splitNode(node, block.width, block.height);
            else
                block.fit = this.growNode(block.width, block.height);
        }
    }


    findNode (root : Node | undefined, w : number, h : number)  : Node | null {
        if ( root ){
            if( root.used) {
                return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
            }
            else if ((w <= root.width) && (h <= root.height)) {
                return root;
            }
        }
        return null;
    }



    splitNode (node : Node, w: number, h : number) : Node {
        node.used = true;
        node.down = {x: node.x, y: node.y + h, width: node.width, height: node.height - h};
        node.right = {x: node.x + w, y: node.y, width: node.width - w, height: h};
        return node;
    }



    growNode(w : number, h : number) : Node | null {
        if( this.root){
            let canGrowDown : boolean = (w <= this.root.width);
            let canGrowRight : boolean = (h <= this.root.height);

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

    growRight (w : number, h : number) : Node | null {
        if( this.root){

            this.root = {
                used: true,
                x: 0,
                y: 0,
                width: this.root.width + w,
                height: this.root.height,
                down: this.root,
                right: {x: this.root.width, y: 0, width: w, height: this.root.height}
            };

            var node = this.findNode(this.root, w, h);
            if (node) {
                return this.splitNode(node, w, h);
            }
        }

        return null;
    }


    growDown (w : number, h : number) : Node  | null {
        if( this.root){

            this.root = {
                used: true,
                x: 0,
                y: 0,
                width: this.root.width,
                height: this.root.height + h,
                down: {x: 0, y: this.root.height, width: this.root.width, height: h},
                right: this.root
            };
            let node = this.findNode(this.root, w, h);
            if (node)
                return this.splitNode(node, w, h);
        }

        return null;
    }

};


export {GrowingPacker};