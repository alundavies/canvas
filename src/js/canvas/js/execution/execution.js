class Execution {
    constructor( graph){
        this.graph=graph;
    }

    runVertexWithId( id){
        let cell = graph.model.getCell( id);
        if( cell.context && cell.context.run()){
            setTimeout( () => {
                cell.context.run();
            }, 0);
        }
    }

    runGraph() {
        this.graph
    }
}