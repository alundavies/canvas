
/**
 *
 */
var OutlineWindow = function(editorUi, x, y, w, h)
{
    var graph = editorUi.editor.graph;

    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.border = '1px solid whiteSmoke';
    div.style.overflow = 'hidden';

    this.window = new mxWindow(mxResources.get('outline'), div, x, y, w, h, true, true);
    this.window.destroyOnClose = false;
    this.window.setMaximizable(false);
    this.window.setResizable(true);
    this.window.setClosable(true);
    this.window.setVisible(true);

    this.window.setLocation = function(x, y)
    {
        x = Math.max(0, x);
        y = Math.max(0, y);
        mxWindow.prototype.setLocation.apply(this, arguments);
    };

    mxEvent.addListener(window, 'resize', mxUtils.bind(this, function()
    {
        var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var x = this.window.getX();
        var y = this.window.getY();

        if (x + this.window.table.clientWidth > iw)
        {
            x = Math.max(0, iw - this.window.table.clientWidth);
        }

        if (y + this.window.table.clientHeight > ih)
        {
            y = Math.max(0, ih - this.window.table.clientHeight);
        }

        if (this.window.getX() != x || this.window.getY() != y)
        {
            this.window.setLocation(x, y);
        }
    }));

    var outline = editorUi.createOutline(this.window);

    this.window.addListener(mxEvent.RESIZE, mxUtils.bind(this, function()
    {
        outline.update(false);
        outline.outline.sizeDidChange();
    }));

    this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
    {
        outline.suspended = false;
        outline.outline.refresh();
        outline.update();
    }));

    this.window.addListener(mxEvent.HIDE, mxUtils.bind(this, function()
    {
        outline.suspended = true;
    }));

    this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, function()
    {
        outline.suspended = false;
        outline.update();
    }));

    this.window.addListener(mxEvent.MINIMIZE, mxUtils.bind(this, function()
    {
        outline.suspended = true;
    }));

    var outlineCreateGraph = outline.createGraph;
    outline.createGraph = function(container)
    {
        var g = outlineCreateGraph.apply(this, arguments);
        g.gridEnabled = false;
        g.pageScale = graph.pageScale;
        g.pageFormat = graph.pageFormat;
        g.background = graph.background;
        g.pageVisible = graph.pageVisible;

        var current = mxUtils.getCurrentStyle(graph.container);
        div.style.backgroundColor = current.backgroundColor;

        return g;
    };

    function update()
    {
        outline.outline.pageScale = graph.pageScale;
        outline.outline.pageFormat = graph.pageFormat;
        outline.outline.pageVisible = graph.pageVisible;
        outline.outline.background = graph.background;

        var current = mxUtils.getCurrentStyle(graph.container);
        div.style.backgroundColor = current.backgroundColor;

        if (graph.view.backgroundPageShape != null && outline.outline.view.backgroundPageShape != null)
        {
            outline.outline.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
        }

        outline.outline.refresh();
    };

    outline.init(div);

    editorUi.editor.addListener('resetGraphView', update);
    editorUi.addListener('pageFormatChanged', update);
    editorUi.addListener('backgroundColorChanged', update);
    editorUi.addListener('backgroundImageChanged', update);
    editorUi.addListener('pageViewChanged', function()
    {
        update();
        outline.update(true);
    });

    if (outline.outline.dialect == mxConstants.DIALECT_SVG)
    {
        var zoomInAction = editorUi.actions.get('zoomIn');
        var zoomOutAction = editorUi.actions.get('zoomOut');

        mxEvent.addMouseWheelListener(function(evt, up)
        {
            var outlineWheel = false;
            var source = mxEvent.getSource(evt);

            while (source != null)
            {
                if (source == outline.outline.view.canvas.ownerSVGElement)
                {
                    outlineWheel = true;
                    break;
                }

                source = source.parentNode;
            }

            if (outlineWheel)
            {
                if (up)
                {
                    zoomInAction.funct();
                }
                else
                {
                    zoomOutAction.funct();
                }

                mxEvent.consume(evt);
            }
        });
    }
};


