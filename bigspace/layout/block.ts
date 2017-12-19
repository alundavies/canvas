interface BlockFit {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Block {

    x: number;
    y: number;
    width: number;
    height: number;
    fit?: BlockFit;
}

export { Block };
export { BlockFit };