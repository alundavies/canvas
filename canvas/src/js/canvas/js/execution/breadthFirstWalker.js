class BreadthFirstWalker {

    constructor( model, visitor ){
        this.model = model;
        this.visitor = visitor;
    }

    walk( rootCell) {



        if( cell != null) {
            let childCells = this.model.getChildCells( rootCell);

            this.slowVisit( this.model, childCells,  cell => {

            return true; // continue visiting sub cells
            }, 0);
        }
    }

}