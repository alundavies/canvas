import { GrowingPacker } from './2d-packer';
import { BigSpaceLayout } from '../big-space-layout';
import { Block } from '../block';

export  { TwoDimensionalBinPackerLayout };

class TwoDimensionalBinPackerLayout extends BigSpaceLayout {

    packer : GrowingPacker = new GrowingPacker();

    constructor(){
        super();
    }

    layout( blocks : Block[]) : void {
        blocks = blocks.sort( ( a: Block, b: Block ) => { return b.width - a.width; });
        this.packer.fit( blocks);
    }
}

