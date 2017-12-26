/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel = function(format, editorUi, container)
{
    BaseFormatPanel.call(this, format, editorUi, container);
    this.init();
};

mxUtils.extend(DiagramFormatPanel, BaseFormatPanel);

/**
 * Specifies if the background image option should be shown. Default is true.
 */
DiagramFormatPanel.prototype.showBackgroundImageOption = true;

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.init = function()
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    this.container.appendChild(this.addView(this.createPanel()));

    if (graph.isEnabled())
    {
        this.container.appendChild(this.addOptions(this.createPanel()));
        //this.container.appendChild(this.addPaperSize(this.createPanel()));
        this.container.appendChild(this.addStyleOps(this.createPanel()));
    }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addView = function(div)
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    div.appendChild(this.createTitle(mxResources.get('view')));

    // Grid
    this.addGridOption(div);

    if (graph.isEnabled())
    {
        // Guides
        div.appendChild(this.createOption(mxResources.get('guides'), function()
            {
                return graph.graphHandler.guidesEnabled;
            }, function(checked)
            {
                ui.actions.get('guides').funct();
            },
            {
                install: function(apply)
                {
                    this.listener = function()
                    {
                        apply(graph.graphHandler.guidesEnabled);
                    };

                    ui.addListener('guidesEnabledChanged', this.listener);
                },
                destroy: function()
                {
                    ui.removeListener(this.listener);
                }
            }));

        // Page View
        /*	div.appendChild(this.createOption(mxResources.get('pageView'), function()
		{
			return graph.pageVisible;
		}, function(checked)
		{
			ui.actions.get('pageView').funct();
		},
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.pageVisible);
				};

				ui.addListener('pageViewChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		}));*/

        // Background
        var bg = this.createColorOption(mxResources.get('background'), function()
            {
                return graph.background;
            }, function(color)
            {
                ui.setBackgroundColor(color);
            }, '#ffffff',
            {
                install: function(apply)
                {
                    this.listener = function()
                    {
                        apply(graph.background);
                    };

                    ui.addListener('backgroundColorChanged', this.listener);
                },
                destroy: function()
                {
                    ui.removeListener(this.listener);
                }
            });

        if (this.showBackgroundImageOption)
        {
            var btn = mxUtils.button(mxResources.get('image'), function(evt)
            {
                ui.showBackgroundImageDialog();
                mxEvent.consume(evt);
            })

            btn.style.position = 'absolute';
            btn.className = 'geColorBtn';
            btn.style.marginTop = '-4px';
            btn.style.paddingBottom = (document.documentMode == 11 || mxClient.IS_MT) ? '0px' : '2px';
            btn.style.height = '22px';
            btn.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';
            btn.style.width = '56px';

            bg.appendChild(btn);
        }

        div.appendChild(bg);
    }

    return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addOptions = function(div)
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    div.appendChild(this.createTitle(mxResources.get('options')));

    if (graph.isEnabled())
    {
        // Connection arrows
        div.appendChild(this.createOption(mxResources.get('connectionArrows'), function()
            {
                return graph.connectionArrowsEnabled;
            }, function(checked)
            {
                ui.actions.get('connectionArrows').funct();
            },
            {
                install: function(apply)
                {
                    this.listener = function()
                    {
                        apply(graph.connectionArrowsEnabled);
                    };

                    ui.addListener('connectionArrowsChanged', this.listener);
                },
                destroy: function()
                {
                    ui.removeListener(this.listener);
                }
            }));

        // Connection points
        div.appendChild(this.createOption(mxResources.get('connectionPoints'), function()
            {
                return graph.connectionHandler.isEnabled();
            }, function(checked)
            {
                ui.actions.get('connectionPoints').funct();
            },
            {
                install: function(apply)
                {
                    this.listener = function()
                    {
                        apply(graph.connectionHandler.isEnabled());
                    };

                    ui.addListener('connectionPointsChanged', this.listener);
                },
                destroy: function()
                {
                    ui.removeListener(this.listener);
                }
            }));
    }

    return div;
};

/**
 *
 */
DiagramFormatPanel.prototype.addGridOption = function(container)
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;

    var input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.textAlign = 'right';
    input.style.width = '38px';
    input.value = graph.getGridSize() + ' pt';

    var stepper = this.createStepper(input, update);
    input.style.display = (graph.isGridEnabled()) ? '' : 'none';
    stepper.style.display = input.style.display;

    mxEvent.addListener(input, 'keydown', function(e)
    {
        if (e.keyCode == 13)
        {
            graph.container.focus();
            mxEvent.consume(e);
        }
        else if (e.keyCode == 27)
        {
            input.value = graph.getGridSize();
            graph.container.focus();
            mxEvent.consume(e);
        }
    });

    function update(evt)
    {
        var value = parseInt(input.value);
        value = Math.max(1, (isNaN(value)) ? 10 : value);

        if (value != graph.getGridSize())
        {
            graph.setGridSize(value)
        }

        input.value = value + ' pt';
        mxEvent.consume(evt);
    };

    mxEvent.addListener(input, 'blur', update);
    mxEvent.addListener(input, 'change', update);

    if (mxClient.IS_SVG)
    {
        input.style.marginTop = '-2px';
        input.style.right = '84px';
        stepper.style.marginTop = '-16px';
        stepper.style.right = '72px';

        var panel = this.createColorOption(mxResources.get('grid'), function()
            {
                var color = graph.view.gridColor;

                return (graph.isGridEnabled()) ? color : null;
            }, function(color)
            {
                if (color == mxConstants.NONE)
                {
                    graph.setGridEnabled(false);
                    ui.fireEvent(new mxEventObject('gridEnabledChanged'));
                }
                else
                {
                    graph.setGridEnabled(true);
                    ui.setGridColor(color);
                }

                input.style.display = (graph.isGridEnabled()) ? '' : 'none';
                stepper.style.display = input.style.display;
            }, '#e0e0e0',
            {
                install: function(apply)
                {
                    this.listener = function()
                    {
                        apply((graph.isGridEnabled()) ? graph.view.gridColor : null);
                    };

                    ui.addListener('gridColorChanged', this.listener);
                    ui.addListener('gridEnabledChanged', this.listener);
                },
                destroy: function()
                {
                    ui.removeListener(this.listener);
                }
            });

        panel.appendChild(input);
        panel.appendChild(stepper);
        container.appendChild(panel);
    }
    else
    {
        input.style.marginTop = '2px';
        input.style.right = '32px';
        stepper.style.marginTop = '2px';
        stepper.style.right = '20px';

        container.appendChild(input);
        container.appendChild(stepper);

        container.appendChild(this.createOption(mxResources.get('grid'), function()
            {
                return graph.isGridEnabled();
            }, function(checked)
            {
                graph.setGridEnabled(checked);

                if (graph.isGridEnabled())
                {
                    graph.view.gridColor = '#e0e0e0';
                }

                ui.fireEvent(new mxEventObject('gridEnabledChanged'));
            },
            {
                install: function(apply)
                {
                    this.listener = function()
                    {
                        input.style.display = (graph.isGridEnabled()) ? '' : 'none';
                        stepper.style.display = input.style.display;

                        apply(graph.isGridEnabled());
                    };

                    ui.addListener('gridEnabledChanged', this.listener);
                },
                destroy: function()
                {
                    ui.removeListener(this.listener);
                }
            }));
    }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addDocumentProperties = function(div)
{
    // Hook for subclassers
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    div.appendChild(this.createTitle(mxResources.get('options')));

    return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addPaperSize = function(div)
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    div.appendChild(this.createTitle(mxResources.get('paperSize')));

    var accessor = PageSetupDialog.addPageFormatPanel(div, 'formatpanel', graph.pageFormat, function(pageFormat)
    {
        if (graph.pageFormat == null || graph.pageFormat.width != pageFormat.width || graph.pageFormat.height != pageFormat.height)
        {
            ui.setPageFormat(pageFormat);
        }
    });

    this.addKeyHandler(accessor.widthInput, function()
    {
        console.log('here', graph.pageFormat);
        accessor.set(graph.pageFormat);
    });
    -	this.addKeyHandler(accessor.heightInput, function()
    {
        accessor.set(graph.pageFormat);
    });

    var listener = function()
    {
        accessor.set(graph.pageFormat);
    };

    ui.addListener('pageFormatChanged', listener);
    this.listeners.push({destroy: function() { ui.removeListener(listener); }});

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});

    return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addStyleOps = function(div)
{
    var btn = mxUtils.button(mxResources.get('editData'), mxUtils.bind(this, function(evt)
    {
        this.editorUi.actions.get('editData').funct();
    }));

    btn.setAttribute('title', mxResources.get('editData') + ' (' + this.editorUi.actions.get('editData').shortcut + ')');
    btn.style.width = '202px';
    btn.style.marginBottom = '2px';
    div.appendChild(btn);

    mxUtils.br(div);

    btn = mxUtils.button(mxResources.get('clearDefaultStyle'), mxUtils.bind(this, function(evt)
    {
        this.editorUi.actions.get('clearDefaultStyle').funct();
    }));

    btn.setAttribute('title', mxResources.get('clearDefaultStyle') + ' (' + this.editorUi.actions.get('clearDefaultStyle').shortcut + ')');
    btn.style.width = '202px';
    div.appendChild(btn);

    return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.destroy = function()
{
    BaseFormatPanel.prototype.destroy.apply(this, arguments);

    if (this.gridEnabledListener)
    {
        this.editorUi.removeListener(this.gridEnabledListener);
        this.gridEnabledListener = null;
    }
};
