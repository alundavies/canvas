class Experiments {

    constructor() {

        this.MODEL_EVENTS = [
            mxEvent.CHANGE,
            mxEvent.NOTIFY,
            mxEvent.EXECUTE,
            mxEvent.EXECUTED,
            mxEvent.BEGIN_UPDATE,
            mxEvent.START_EDIT,
            mxEvent.END_UPDATE,
            mxEvent.END_EDIT,
            mxEvent.BEFORE_UNDO,
            mxEvent.UNDO
        ];

        // Add event listeners
        this.model = window.editor.graph.getModel();

        for (let eventName of this.MODEL_EVENTS) {
            this.model.addListener(eventName, (sender, evt) => {
                //  console.log( eventName, evt);
            });
        }


        // Changes fill color to red on mouseover
        window.editor.graph.addMouseListener(
        {
            currentState: null,
            previousStyle: null,
            mouseDown: function (sender, me) {
                console.log( 'mouse down: ', me);
            },
            mouseMove: function (sender, me) {
            },
            mouseUp: function (sender, me) {

                console.log( 'mouse up: ', me.graphX, me.graphY)
            },
            dragEnter: function (evt, state) {
            },
            dragLeave: function (evt, state) {
            }
        });
    }


    /*let counter = 0;
    setInterval( function(){
        let model = window.editor.graph.getModel();
        let cell = model.getCell(1771);
        if( cell!=null) {
            counter ++;
            model.beginUpdate();
            try{
               // cell.value='Updated '+new Date();
               // cell.style[ 'fillColor'] = '#ff0000';
                model.setValue( cell, 'Updated '+new Date().getTime()/1000+' id: '+cell.id);
                let style = model.getStyle( cell);
                style = buildStyleWithAttribute( style, 'fillColor', counter%2==0?'#00cc00':'#cc0000');

                model.setStyle( cell, style);
            } finally {
                model.endUpdate()
            }
        }
    }, 3000);*/

    buildStyleWithAttribute( style, attr, value) {

        if( style!=null) {
            style = style.split(';');
            for (let styleAttribute in style) {
                if (style[styleAttribute].startsWith(attr + '=')) {
                    style[styleAttribute] = attr + '=' + value;
                    return style.join(';');
                }
            }

            style.push( attr+'='+value);
            return style.join(';');
        }

        // no style updated so add to end
        let updatedStyle = attr+'='+value;

        return updatedStyle;
    };


     slowVisit( model, cells, visitor, wait){


        model.beginUpdate();
        try {
            for( let cell of cells){

                setTimeout( () => {

                    let visitChildren = visitor( cell);
                    let connectedDownstreamCells = [];

                    if( visitChildren) {

                        let outgoingEdges = model.getOutgoingEdges( cell);
                        for( let edge of outgoingEdges){
                            if( edge.target!=null) {
                                connectedDownstreamCells.push( edge.target);
                            }
                        }

                        if( connectedDownstreamCells.length>0) {
                            setTimeout(() => {
                                this.slowVisit(this.model, connectedDownstreamCells, visitor, wait);
                            }, wait);
                        }
                    }
                }, 10);

                let startCells = [];
                let children = model.getChildVertices( cell);
                for( let child of children){
                    let incomingEdges = model.getIncomingEdges( child);
                    if( incomingEdges && incomingEdges.length==0){
                        startCells.push( child);
                    }
                }

                if( startCells.length>0) {
                    setTimeout(() => {
                        this.slowVisit(this.model, startCells, visitor, wait);
                    }, wait);
                }

            }
        } finally {
            model.endUpdate();
        }

    }

    walkATree() {

        // Reset all cells of 1454 to be white

        //let cell = this.model.getCell(4579) || this.model.getCell( 1771);
        let cell = this.model.getRoot();
        let childCells = this.model.getChildCells( cell);
        if( cell != null) {
            console.log( childCells);
            this.slowVisit( this.model, childCells,  cell => {
                cell.run=false;
                //this.model.setValue(cell, 'id: ' + cell.id);
                let style = this.model.getStyle(cell);
                style = this.buildStyleWithAttribute(style, 'fillColor', '#ffffff');
                this.model.setStyle(cell, style);
                return true; // continue visiting sub cells
            }, 0);
        }

        // kick this off with a run command perhaps
        setTimeout( () => {

            this.slowVisit( this.model, childCells, cell => {
                //this.model.setValue( cell, 'id: '+cell.id);
                let incomingEdges = this.model.getIncomingEdges( cell);
                for( let edge of incomingEdges) {
                    // console.log( 'edge detail: ', cell.id, edge.source?edge.source.run:'no run');
                    if( !edge.source || !edge.source.run){
                        return false;
                    }
                }

                let style = this.model.getStyle( cell);
                //this.model.setValue( cell, 'id: '+cell.id, ' time: ',+ new Date().getTime())
                style = this.buildStyleWithAttribute( style, 'fillColor', '#00cc00');
                this.model.setStyle( cell, style);

                let value = this.model.getValue( cell);
                //if( value && value.startsWith( 'function')){
                //    console.log( value);
                //};

                if( value=='JavaScript'){
                    console.log( 'Javascript detected');
                }
                else if( value.trim().startsWith( 'function')){
                    console.log( 'Javascript function detected: ', cell);
                    eval( value);
                }
                //console.log( value)

                cell.run = true;

                return true;

            }, 750);
        }, 1500);
    }
}
