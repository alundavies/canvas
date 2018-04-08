/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel = function(format, editorUi, container)
{
    BaseFormatPanel.call(this, format, editorUi, container);
    this.init();
};

mxUtils.extend(ArrangePanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.init = function()
{
    var graph = this.editorUi.editor.graph;
    var ss = this.format.getSelectionState();

    this.container.appendChild(this.addLayerOps(this.createPanel()));
    // Special case that adds two panels
    this.addGeometry(this.container);
    this.addEdgeGeometry(this.container);

    if (!ss.containsLabel || ss.edges.length == 0)
    {
        this.container.appendChild(this.addAngle(this.createPanel()));
    }

    if (!ss.containsLabel && ss.edges.length == 0)
    {
        this.container.appendChild(this.addFlip(this.createPanel()));
    }

    if (ss.vertices.length > 1)
    {
        this.container.appendChild(this.addAlign(this.createPanel()));
        this.container.appendChild(this.addDistribute(this.createPanel()));
    }

    this.container.appendChild(this.addGroupOps(this.createPanel()));
};

/**
 *
 */
ArrangePanel.prototype.addLayerOps = function(div)
{
    var ui = this.editorUi;

    var btn = mxUtils.button(mxResources.get('toFront'), function(evt)
    {
        ui.actions.get('toFront').funct();
    })

    btn.setAttribute('title', mxResources.get('toFront') + ' (' + this.editorUi.actions.get('toFront').shortcut + ')');
    btn.style.width = '100px';
    btn.style.marginRight = '2px';
    div.appendChild(btn);

    var btn = mxUtils.button(mxResources.get('toBack'), function(evt)
    {
        ui.actions.get('toBack').funct();
    })

    btn.setAttribute('title', mxResources.get('toBack') + ' (' + this.editorUi.actions.get('toBack').shortcut + ')');
    btn.style.width = '100px';
    div.appendChild(btn);

    return div;
};

/**
 *
 */
ArrangePanel.prototype.addGroupOps = function(div)
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var cell = graph.getSelectionCell();
    var ss = this.format.getSelectionState();
    var count = 0;

    div.style.paddingTop = '8px';
    div.style.paddingBottom = '6px';

    if (graph.getSelectionCount() > 1)
    {
        btn = mxUtils.button(mxResources.get('group'), function(evt)
        {
            ui.actions.get('group').funct();
        })

        btn.setAttribute('title', mxResources.get('group') + ' (' + this.editorUi.actions.get('group').shortcut + ')');
        btn.style.width = '202px';
        btn.style.marginBottom = '2px';
        div.appendChild(btn);
        count++;
    }
    else if (graph.getSelectionCount() == 1 && !graph.getModel().isEdge(cell) && !graph.isSwimlane(cell) &&
        graph.getModel().getChildCount(cell) > 0)
    {
        btn = mxUtils.button(mxResources.get('ungroup'), function(evt)
        {
            ui.actions.get('ungroup').funct();
        })

        btn.setAttribute('title', mxResources.get('ungroup') + ' (' + this.editorUi.actions.get('ungroup').shortcut + ')');
        btn.style.width = '202px';
        btn.style.marginBottom = '2px';
        div.appendChild(btn);
        count++;
    }

    if (graph.getSelectionCount() == 1 && graph.getModel().isVertex(cell) &&
        graph.getModel().isVertex(graph.getModel().getParent(cell)))
    {
        if (count > 0)
        {
            mxUtils.br(div);
        }

        btn = mxUtils.button(mxResources.get('removeFromGroup'), function(evt)
        {
            ui.actions.get('removeFromGroup').funct();
        })

        btn.setAttribute('title', mxResources.get('removeFromGroup'));
        btn.style.width = '202px';
        btn.style.marginBottom = '2px';
        div.appendChild(btn);
        count++;
    }
    else if (graph.getSelectionCount() > 0)
    {
        if (count > 0)
        {
            mxUtils.br(div);
        }

        btn = mxUtils.button(mxResources.get('clearWaypoints'), mxUtils.bind(this, function(evt)
        {
            this.editorUi.actions.get('clearWaypoints').funct();
        }));

        btn.setAttribute('title', mxResources.get('clearWaypoints') + ' (' + this.editorUi.actions.get('clearWaypoints').shortcut + ')');
        btn.style.width = '202px';
        btn.style.marginBottom = '2px';
        div.appendChild(btn);

        count++;
    }

    if (graph.getSelectionCount() == 1)
    {
        if (count > 0)
        {
            mxUtils.br(div);
        }

        btn = mxUtils.button(mxResources.get('editData'), mxUtils.bind(this, function(evt)
        {
            this.editorUi.actions.get('editData').funct();
        }));

        btn.setAttribute('title', mxResources.get('editData') + ' (' + this.editorUi.actions.get('editData').shortcut + ')');
        btn.style.width = '100px';
        btn.style.marginBottom = '2px';
        div.appendChild(btn);
        count++;

        btn = mxUtils.button(mxResources.get('editLink'), mxUtils.bind(this, function(evt)
        {
            this.editorUi.actions.get('editLink').funct();
        }));

        btn.setAttribute('title', mxResources.get('editLink'));
        btn.style.width = '100px';
        btn.style.marginLeft = '2px';
        btn.style.marginBottom = '2px';
        div.appendChild(btn);
        count++;
    }

    if (count == 0)
    {
        div.style.display = 'none';
    }

    return div;
};

/**
 *
 */
ArrangePanel.prototype.addAlign = function(div)
{
    var graph = this.editorUi.editor.graph;
    div.style.paddingTop = '6px';
    div.style.paddingBottom = '12px';
    div.appendChild(this.createTitle(mxResources.get('align')));

    var stylePanel = document.createElement('div');
    stylePanel.style.position = 'relative';
    stylePanel.style.paddingLeft = '0px';
    stylePanel.style.borderWidth = '0px';
    stylePanel.className = 'geToolbarContainer';

    if (mxClient.IS_QUIRKS)
    {
        div.style.height = '60px';
    }

    var left = this.editorUi.toolbar.addButton('geSprite-alignleft', mxResources.get('left'),
        function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, stylePanel);
    var center = this.editorUi.toolbar.addButton('geSprite-aligncenter', mxResources.get('center'),
        function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, stylePanel);
    var right = this.editorUi.toolbar.addButton('geSprite-alignright', mxResources.get('right'),
        function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, stylePanel);

    var top = this.editorUi.toolbar.addButton('geSprite-aligntop', mxResources.get('top'),
        function() { graph.alignCells(mxConstants.ALIGN_TOP); }, stylePanel);
    var middle = this.editorUi.toolbar.addButton('geSprite-alignmiddle', mxResources.get('middle'),
        function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, stylePanel);
    var bottom = this.editorUi.toolbar.addButton('geSprite-alignbottom', mxResources.get('bottom'),
        function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, stylePanel);

    this.styleButtons([left, center, right, top, middle, bottom]);
    right.style.marginRight = '6px';
    div.appendChild(stylePanel);

    return div;
};

/**
 *
 */
ArrangePanel.prototype.addFlip = function(div)
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    div.style.paddingTop = '6px';
    div.style.paddingBottom = '10px';

    var span = document.createElement('div');
    span.style.marginTop = '2px';
    span.style.marginBottom = '8px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('flip'));
    div.appendChild(span);

    var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
    {
        graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
    })

    btn.setAttribute('title', mxResources.get('horizontal'));
    btn.style.width = '100px';
    btn.style.marginRight = '2px';
    div.appendChild(btn);

    var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
    {
        graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
    })

    btn.setAttribute('title', mxResources.get('vertical'));
    btn.style.width = '100px';
    div.appendChild(btn);

    return div;
};

/**
 *
 */
ArrangePanel.prototype.addDistribute = function(div)
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    div.style.paddingTop = '6px';
    div.style.paddingBottom = '12px';

    div.appendChild(this.createTitle(mxResources.get('distribute')));

    var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
    {
        graph.distributeCells(true);
    })

    btn.setAttribute('title', mxResources.get('horizontal'));
    btn.style.width = '100px';
    btn.style.marginRight = '2px';
    div.appendChild(btn);

    var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
    {
        graph.distributeCells(false);
    })

    btn.setAttribute('title', mxResources.get('vertical'));
    btn.style.width = '100px';
    div.appendChild(btn);

    return div;
};

/**
 *
 */
ArrangePanel.prototype.addAngle = function(div)
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();

    div.style.paddingBottom = '8px';

    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';

    var input = null;
    var update = null;
    var btn = null;

    if (ss.edges.length == 0)
    {
        mxUtils.write(span, mxResources.get('angle'));
        div.appendChild(span);

        input = this.addUnitInput(div, '°', 20, 44, function()
        {
            update.apply(this, arguments);
        });

        mxUtils.br(div);
        div.style.paddingTop = '10px';
    }
    else
    {
        div.style.paddingTop = '8px';
    }

    if (!ss.containsLabel)
    {
        var label = mxResources.get('reverse');

        if (ss.vertices.length > 0 && ss.edges.length > 0)
        {
            label = mxResources.get('turn') + ' / ' + label;
        }
        else if (ss.vertices.length > 0)
        {
            label = mxResources.get('turn');
        }

        btn = mxUtils.button(label, function(evt)
        {
            ui.actions.get('turn').funct();
        })

        btn.setAttribute('title', label + ' (' + this.editorUi.actions.get('turn').shortcut + ')');
        btn.style.width = '202px';
        div.appendChild(btn);

        if (input != null)
        {
            btn.style.marginTop = '8px';
        }
    }

    if (input != null)
    {
        var listener = mxUtils.bind(this, function(sender, evt, force)
        {
            if (force || document.activeElement != input)
            {
                ss = this.format.getSelectionState();
                var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_ROTATION, 0));
                input.value = (isNaN(tmp)) ? '' : tmp  + '°';
            }
        });

        update = this.installInputHandler(input, mxConstants.STYLE_ROTATION, 0, 0, 360, '°', null, true);
        this.addKeyHandler(input, listener);

        graph.getModel().addListener(mxEvent.CHANGE, listener);
        this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
        listener();
    }

    return div;
};

/**
 *
 */
ArrangePanel.prototype.addGeometry = function(container)
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var rect = this.format.getSelectionState();

    var div = this.createPanel();
    div.style.paddingBottom = '8px';

    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '50px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('size'));
    div.appendChild(span);

    var widthUpdate, heightUpdate, leftUpdate, topUpdate;
    var width = this.addUnitInput(div, 'pt', 84, 44, function()
    {
        widthUpdate.apply(this, arguments);
    });
    var height = this.addUnitInput(div, 'pt', 20, 44, function()
    {
        heightUpdate.apply(this, arguments);
    });

    var autosizeBtn = document.createElement('div');
    autosizeBtn.className = 'geSprite geSprite-fit';
    autosizeBtn.setAttribute('title', mxResources.get('autosize') + ' (' + this.editorUi.actions.get('autosize').shortcut + ')');
    autosizeBtn.style.position = 'relative';
    autosizeBtn.style.cursor = 'pointer';
    autosizeBtn.style.marginTop = '-3px';
    autosizeBtn.style.border = '0px';
    autosizeBtn.style.left = '52px';
    mxUtils.setOpacity(autosizeBtn, 50);

    mxEvent.addListener(autosizeBtn, 'mouseenter', function()
    {
        mxUtils.setOpacity(autosizeBtn, 100);
    });

    mxEvent.addListener(autosizeBtn, 'mouseleave', function()
    {
        mxUtils.setOpacity(autosizeBtn, 50);
    });

    mxEvent.addListener(autosizeBtn, 'click', function()
    {
        ui.actions.get('autosize').funct();
    });

    div.appendChild(autosizeBtn);
    this.addLabel(div, mxResources.get('width'), 84);
    this.addLabel(div, mxResources.get('height'), 20);
    mxUtils.br(div);

    var wrapper = document.createElement('div');
    wrapper.style.paddingTop = '8px';
    wrapper.style.paddingRight = '20px';
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.style.textAlign = 'right';
    var opt = this.createCellOption(mxResources.get('constrainProportions'),
        mxConstants.STYLE_ASPECT, null, 'fixed', 'null');
    opt.style.width = '100%';
    wrapper.appendChild(opt);
    div.appendChild(wrapper);

    this.addKeyHandler(width, listener);
    this.addKeyHandler(height, listener);

    widthUpdate = this.addGeometryHandler(width, function(geo, value)
    {
        if (geo.width > 0)
        {
            geo.width = Math.max(1, value);
        }
    });
    heightUpdate = this.addGeometryHandler(height, function(geo, value)
    {
        if (geo.height > 0)
        {
            geo.height = Math.max(1, value);
        }
    });

    container.appendChild(div);

    var div2 = this.createPanel();
    div2.style.paddingBottom = '30px';

    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('position'));
    div2.appendChild(span);

    var left = this.addUnitInput(div2, 'pt', 84, 44, function()
    {
        leftUpdate.apply(this, arguments);
    });
    var top = this.addUnitInput(div2, 'pt', 20, 44, function()
    {
        topUpdate.apply(this, arguments);
    });

    mxUtils.br(div2);
    this.addLabel(div2, mxResources.get('left'), 84);
    this.addLabel(div2, mxResources.get('top'), 20);

    var listener = mxUtils.bind(this, function(sender, evt, force)
    {
        rect = this.format.getSelectionState();

        if (!rect.containsLabel && rect.vertices.length == graph.getSelectionCount() &&
            rect.width != null && rect.height != null)
        {
            div.style.display = '';

            if (force || document.activeElement != width)
            {
                width.value = rect.width + ((rect.width == '') ? '' : ' pt');
            }

            if (force || document.activeElement != height)
            {
                height.value = rect.height + ((rect.height == '') ? '' : ' pt');
            }
        }
        else
        {
            div.style.display = 'none';
        }

        if (rect.vertices.length == graph.getSelectionCount() &&
            rect.x != null && rect.y != null)
        {
            div2.style.display = '';

            if (force || document.activeElement != left)
            {
                left.value = rect.x  + ((rect.x == '') ? '' : ' pt');
            }

            if (force || document.activeElement != top)
            {
                top.value = rect.y + ((rect.y == '') ? '' : ' pt');
            }
        }
        else
        {
            div2.style.display = 'none';
        }
    });

    this.addKeyHandler(left, listener);
    this.addKeyHandler(top, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
    listener();

    leftUpdate = this.addGeometryHandler(left, function(geo, value)
    {
        if (geo.relative)
        {
            geo.offset.x = value;
        }
        else
        {
            geo.x = value;
        }
    });
    topUpdate = this.addGeometryHandler(top, function(geo, value)
    {
        if (geo.relative)
        {
            geo.offset.y = value;
        }
        else
        {
            geo.y = value;
        }
    });

    container.appendChild(div2);
};

/**
 *
 */
ArrangePanel.prototype.addGeometryHandler = function(input, fn)
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var initialValue = null;

    function update(evt)
    {
        if (input.value != '')
        {
            var value = parseFloat(input.value);

            if (value != initialValue)
            {
                graph.getModel().beginUpdate();
                try
                {
                    var cells = graph.getSelectionCells();

                    for (var i = 0; i < cells.length; i++)
                    {
                        if (graph.getModel().isVertex(cells[i]))
                        {
                            var geo = graph.getCellGeometry(cells[i]);

                            if (geo != null)
                            {
                                geo = geo.clone();
                                fn(geo, value);

                                graph.getModel().setGeometry(cells[i], geo);
                            }
                        }
                    }
                }
                finally
                {
                    graph.getModel().endUpdate();
                }

                initialValue = value;
                input.value = value + ' pt';
            }
            else if (isNaN(value))
            {
                input.value = initialValue + ' pt';
            }
        }

        mxEvent.consume(evt);
    };

    mxEvent.addListener(input, 'blur', update);
    mxEvent.addListener(input, 'change', update);
    mxEvent.addListener(input, 'focus', function()
    {
        initialValue = input.value;
    });

    return update;
};

/**
 *
 */
ArrangePanel.prototype.addEdgeGeometry = function(container)
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var rect = this.format.getSelectionState();

    var div = this.createPanel();

    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('width'));
    div.appendChild(span);

    var widthUpdate, leftUpdate, topUpdate;
    var width = this.addUnitInput(div, 'pt', 20, 44, function()
    {
        widthUpdate.apply(this, arguments);
    });

    mxUtils.br(div);
    this.addKeyHandler(width, listener);

    function widthUpdate(evt)
    {
        // Maximum stroke width is 999
        var value = parseInt(width.value);
        value = Math.min(999, Math.max(1, (isNaN(value)) ? 1 : value));

        if (value != mxUtils.getValue(rect.style, 'width', mxCellRenderer.prototype.defaultShapes['flexArrow'].prototype.defaultWidth))
        {
            graph.setCellStyles('width', value, graph.getSelectionCells());
            ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['width'],
                'values', [value], 'cells', graph.getSelectionCells()));
        }

        width.value = value + ' pt';
        mxEvent.consume(evt);
    };

    mxEvent.addListener(width, 'blur', widthUpdate);
    mxEvent.addListener(width, 'change', widthUpdate);

    container.appendChild(div);

    var listener = mxUtils.bind(this, function(sender, evt, force)
    {
        rect = this.format.getSelectionState();

        if (rect.style.shape == 'link' || rect.style.shape == 'flexArrow')
        {
            div.style.display = '';

            if (force || document.activeElement != width)
            {
                var value = mxUtils.getValue(rect.style, 'width',
                    mxCellRenderer.prototype.defaultShapes['flexArrow'].prototype.defaultWidth);
                width.value = value + ' pt';
            }
        }
        else
        {
            div.style.display = 'none';
        }
    });

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
    listener();
};
