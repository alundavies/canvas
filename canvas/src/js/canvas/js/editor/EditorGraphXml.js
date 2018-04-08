/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.resetGraph = function()
{
    this.graph.gridEnabled = !this.chromeless || urlParams['grid'] == '1';
    this.graph.graphHandler.guidesEnabled = true;
    this.graph.setTooltips(true);
    this.graph.setConnectable(true);
    this.graph.foldingEnabled = true;
    this.graph.scrollbars = this.graph.defaultScrollbars;
    this.graph.pageVisible = this.graph.defaultPageVisible;
    this.graph.pageBreaksVisible = this.graph.pageVisible;
    this.graph.preferPageSize = this.graph.pageBreaksVisible;
    this.graph.background = this.graph.defaultGraphBackground;
    this.graph.pageScale = mxGraph.prototype.pageScale;
    this.graph.pageFormat = mxGraph.prototype.pageFormat;
    this.updateGraphComponents();
    this.graph.view.setScale(1);
};

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.readGraphState = function(node)
{
    this.graph.gridEnabled = node.getAttribute('grid') != '0' && (!this.chromeless || urlParams['grid'] == '1');
    this.graph.gridSize = parseFloat(node.getAttribute('gridSize')) || mxGraph.prototype.gridSize;
    this.graph.graphHandler.guidesEnabled = node.getAttribute('guides') != '0';
    this.graph.setTooltips(node.getAttribute('tooltips') != '0');
    this.graph.setConnectable(node.getAttribute('connect') != '0');
    this.graph.connectionArrowsEnabled = node.getAttribute('arrows') != '0';
    this.graph.foldingEnabled = node.getAttribute('fold') != '0';

    if (this.chromeless && this.graph.foldingEnabled)
    {
        this.graph.foldingEnabled = urlParams['nav'] == '1';
        this.graph.cellRenderer.forceControlClickHandler = this.graph.foldingEnabled;
    }

    var ps = node.getAttribute('pageScale');

    if (ps != null)
    {
        this.graph.pageScale = ps;
    }
    else
    {
        this.graph.pageScale = mxGraph.prototype.pageScale;
    }

    if (!this.graph.lightbox)
    {
        var pv = node.getAttribute('page');

        if (pv != null)
        {
            this.graph.pageVisible = (pv != '0');
        }
        else
        {
            this.graph.pageVisible = this.graph.defaultPageVisible;
        }
    }
    else
    {
        this.graph.pageVisible = false;
    }

    this.graph.pageBreaksVisible = this.graph.pageVisible;
    this.graph.preferPageSize = this.graph.pageBreaksVisible;

    var pw = node.getAttribute('pageWidth');
    var ph = node.getAttribute('pageHeight');

    if (pw != null && ph != null)
    {
        this.graph.pageFormat = new mxRectangle(0, 0, parseFloat(pw), parseFloat(ph));
    }

    // Loads the persistent state settings
    var bg = node.getAttribute('background');

    if (bg != null && bg.length > 0)
    {
        this.graph.background = bg;
    }
    else
    {
        this.graph.background = this.graph.defaultGraphBackground;
    }
};

/**
 * Sets the XML node for the current diagram.
 */
Editor.prototype.setGraphXml = function(node)
{
    if (node != null)
    {
        var dec = new mxCodec(node.ownerDocument);

        if (node.nodeName == 'mxGraphModel')
        {
            this.graph.model.beginUpdate();

            try
            {
                this.graph.model.clear();
                this.graph.view.scale = 1;
                this.readGraphState(node);
                this.updateGraphComponents();
                dec.decode(node, this.graph.getModel());
            }
            finally
            {
                this.graph.model.endUpdate();
            }

            this.fireEvent(new mxEventObject('resetGraphView'));
        }
        else if (node.nodeName == 'root')
        {
            this.resetGraph();

            // Workaround for invalid XML output in Firefox 20 due to bug in mxUtils.getXml
            var wrapper = dec.document.createElement('mxGraphModel');
            wrapper.appendChild(node);

            dec.decode(wrapper, this.graph.getModel());
            this.updateGraphComponents();
            this.fireEvent(new mxEventObject('resetGraphView'));
        }
        else
        {
            throw {
                message: mxResources.get('cannotOpenFile'),
                node: node,
                toString: function() { return this.message; }
            };
        }
    }
    else
    {
        this.resetGraph();
        this.graph.model.clear();
        this.fireEvent(new mxEventObject('resetGraphView'));
    }
};

/**
 * Returns the XML node that represents the current diagram.
 */
Editor.prototype.getGraphXml = function(ignoreSelection)
{
    ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
    var node = null;

    if (ignoreSelection)
    {
        var enc = new mxCodec(mxUtils.createXmlDocument());
        node = enc.encode(this.graph.getModel());
    }
    else
    {
        node = this.graph.encodeCells(mxUtils.sortCells(this.graph.model.getTopmostCells(
            this.graph.getSelectionCells())));
    }

    if (this.graph.view.translate.x != 0 || this.graph.view.translate.y != 0)
    {
        node.setAttribute('dx', Math.round(this.graph.view.translate.x * 100) / 100);
        node.setAttribute('dy', Math.round(this.graph.view.translate.y * 100) / 100);
    }

    node.setAttribute('grid', (this.graph.isGridEnabled()) ? '1' : '0');
    node.setAttribute('gridSize', this.graph.gridSize);
    node.setAttribute('guides', (this.graph.graphHandler.guidesEnabled) ? '1' : '0');
    node.setAttribute('tooltips', (this.graph.tooltipHandler.isEnabled()) ? '1' : '0');
    node.setAttribute('connect', (this.graph.connectionHandler.isEnabled()) ? '1' : '0');
    node.setAttribute('arrows', (this.graph.connectionArrowsEnabled) ? '1' : '0');
    node.setAttribute('fold', (this.graph.foldingEnabled) ? '1' : '0');
    node.setAttribute('page', (this.graph.pageVisible) ? '1' : '0');
    node.setAttribute('pageScale', this.graph.pageScale);
    node.setAttribute('pageWidth', this.graph.pageFormat.width);
    node.setAttribute('pageHeight', this.graph.pageFormat.height);

    if (this.graph.background != null)
    {
        node.setAttribute('background', this.graph.background);
    }

    return node;
};
