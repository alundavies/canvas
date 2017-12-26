

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel = function(format, editorUi, container)
{
    BaseFormatPanel.call(this, format, editorUi, container);
    this.init();
};

mxUtils.extend(TextFormatPanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.init = function()
{
    this.container.style.borderBottom = 'none';
    this.addFont(this.container);
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.addFont = function(container)
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();

    var title = this.createTitle(mxResources.get('font'));
    title.style.paddingLeft = '18px';
    title.style.paddingTop = '10px';
    title.style.paddingBottom = '6px';
    container.appendChild(title);

    var stylePanel = this.createPanel();
    stylePanel.style.paddingTop = '2px';
    stylePanel.style.paddingBottom = '2px';
    stylePanel.style.position = 'relative';
    stylePanel.style.marginLeft = '-2px';
    stylePanel.style.borderWidth = '0px';
    stylePanel.className = 'geToolbarContainer';

    if (mxClient.IS_QUIRKS)
    {
        stylePanel.style.display = 'block';
    }

    if (graph.cellEditor.isContentEditing())
    {
        var cssPanel = stylePanel.cloneNode();

        var cssMenu = this.editorUi.toolbar.addMenu(mxResources.get('style'),
            mxResources.get('style'), true, 'formatBlock', cssPanel);
        cssMenu.style.color = 'rgb(112, 112, 112)';
        cssMenu.style.whiteSpace = 'nowrap';
        cssMenu.style.overflow = 'hidden';
        cssMenu.style.margin = '0px';
        this.addArrow(cssMenu);
        cssMenu.style.width = '192px';
        cssMenu.style.height = '15px';

        var arrow = cssMenu.getElementsByTagName('div')[0];
        arrow.style.cssFloat = 'right';
        container.appendChild(cssPanel);
    }

    container.appendChild(stylePanel);

    var colorPanel = this.createPanel();
    colorPanel.style.marginTop = '8px';
    colorPanel.style.borderTop = '1px solid #c0c0c0';
    colorPanel.style.paddingTop = '6px';
    colorPanel.style.paddingBottom = '6px';

    var fontMenu = this.editorUi.toolbar.addMenu('Helvetica', mxResources.get('fontFamily'), true, 'fontFamily', stylePanel);
    fontMenu.style.color = 'rgb(112, 112, 112)';
    fontMenu.style.whiteSpace = 'nowrap';
    fontMenu.style.overflow = 'hidden';
    fontMenu.style.margin = '0px';

    this.addArrow(fontMenu);
    fontMenu.style.width = '192px';
    fontMenu.style.height = '15px';

    // Workaround for offset in FF
    if (mxClient.IS_FF)
    {
        fontMenu.getElementsByTagName('div')[0].style.marginTop = '-18px';
    }

    var stylePanel2 = stylePanel.cloneNode(false);
    stylePanel2.style.marginLeft = '-3px';
    var fontStyleItems = this.editorUi.toolbar.addItems(['bold', 'italic', 'underline'], stylePanel2, true);
    fontStyleItems[0].setAttribute('title', mxResources.get('bold') + ' (' + this.editorUi.actions.get('bold').shortcut + ')');
    fontStyleItems[1].setAttribute('title', mxResources.get('italic') + ' (' + this.editorUi.actions.get('italic').shortcut + ')');
    fontStyleItems[2].setAttribute('title', mxResources.get('underline') + ' (' + this.editorUi.actions.get('underline').shortcut + ')');

    var verticalItem = this.editorUi.toolbar.addItems(['vertical'], stylePanel2, true)[0];

    if (mxClient.IS_QUIRKS)
    {
        mxUtils.br(container);
    }

    container.appendChild(stylePanel2);

    this.styleButtons(fontStyleItems);
    this.styleButtons([verticalItem]);

    var stylePanel3 = stylePanel.cloneNode(false);
    stylePanel3.style.marginLeft = '-3px';
    stylePanel3.style.paddingBottom = '0px';

    var left = this.editorUi.toolbar.addButton('geSprite-left', mxResources.get('left'),
        (graph.cellEditor.isContentEditing()) ?
            function()
            {
                document.execCommand('justifyleft', false, null);
            } : this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT]), stylePanel3);
    var center = this.editorUi.toolbar.addButton('geSprite-center', mxResources.get('center'),
        (graph.cellEditor.isContentEditing()) ?
            function()
            {
                document.execCommand('justifycenter', false, null);
            } : this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER]), stylePanel3);
    var right = this.editorUi.toolbar.addButton('geSprite-right', mxResources.get('right'),
        (graph.cellEditor.isContentEditing()) ?
            function()
            {
                document.execCommand('justifyright', false, null);
            } : this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT]), stylePanel3);

    this.styleButtons([left, center, right]);

    if (graph.cellEditor.isContentEditing())
    {
        var clear = this.editorUi.toolbar.addButton('geSprite-removeformat', mxResources.get('removeFormat'),
            function()
            {
                document.execCommand('removeformat', false, null);
            }, stylePanel2);
        this.styleButtons([clear]);
    }

    var top = this.editorUi.toolbar.addButton('geSprite-top', mxResources.get('top'),
        this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_TOP]), stylePanel3);
    var middle = this.editorUi.toolbar.addButton('geSprite-middle', mxResources.get('middle'),
        this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_MIDDLE]), stylePanel3);
    var bottom = this.editorUi.toolbar.addButton('geSprite-bottom', mxResources.get('bottom'),
        this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_BOTTOM]), stylePanel3);

    this.styleButtons([top, middle, bottom]);

    if (mxClient.IS_QUIRKS)
    {
        mxUtils.br(container);
    }

    container.appendChild(stylePanel3);

    // Hack for updating UI state below based on current text selection
    // currentTable is the current selected DOM table updated below
    var sub, sup, full, tableWrapper, currentTable, tableCell, tableRow;

    if (graph.cellEditor.isContentEditing())
    {
        top.style.display = 'none';
        middle.style.display = 'none';
        bottom.style.display = 'none';
        verticalItem.style.display = 'none';

        full = this.editorUi.toolbar.addButton('geSprite-justifyfull', null,
            function()
            {
                document.execCommand('justifyfull', false, null);
            }, stylePanel3);
        this.styleButtons([full,
            sub = this.editorUi.toolbar.addButton('geSprite-subscript', mxResources.get('subscript') + ' (Ctrl+,)',
                function()
                {
                    document.execCommand('subscript', false, null);
                }, stylePanel3), sup = this.editorUi.toolbar.addButton('geSprite-superscript', mxResources.get('superscript') + ' (Ctrl+.)',
                function()
                {
                    document.execCommand('superscript', false, null);
                }, stylePanel3)]);
        full.style.marginRight = '9px';

        var tmp = stylePanel3.cloneNode(false);
        tmp.style.paddingTop = '4px';
        var btns = [this.editorUi.toolbar.addButton('geSprite-orderedlist', mxResources.get('numberedList'),
            function()
            {
                document.execCommand('insertorderedlist', false, null);
            }, tmp),
            this.editorUi.toolbar.addButton('geSprite-unorderedlist', mxResources.get('bulletedList'),
                function()
                {
                    document.execCommand('insertunorderedlist', false, null);
                }, tmp),
            this.editorUi.toolbar.addButton('geSprite-outdent', mxResources.get('decreaseIndent'),
                function()
                {
                    document.execCommand('outdent', false, null);
                }, tmp),
            this.editorUi.toolbar.addButton('geSprite-indent', mxResources.get('increaseIndent'),
                function()
                {
                    document.execCommand('indent', false, null);
                }, tmp),
            this.editorUi.toolbar.addButton('geSprite-code', mxResources.get('html'),
                function()
                {
                    graph.cellEditor.toggleViewMode();
                }, tmp)];
        this.styleButtons(btns);
        btns[btns.length - 1].style.marginLeft = '9px';

        if (mxClient.IS_QUIRKS)
        {
            mxUtils.br(container);
            tmp.style.height = '40';
        }

        container.appendChild(tmp);
    }
    else
    {
        fontStyleItems[2].style.marginRight = '9px';
        right.style.marginRight = '9px';
    }

    // Label position
    var stylePanel4 = stylePanel.cloneNode(false);
    stylePanel4.style.marginLeft = '0px';
    stylePanel4.style.paddingTop = '8px';
    stylePanel4.style.paddingBottom = '4px';
    stylePanel4.style.fontWeight = 'normal';

    mxUtils.write(stylePanel4, mxResources.get('position'));

    // Adds label position options
    var positionSelect = document.createElement('select');
    positionSelect.style.position = 'absolute';
    positionSelect.style.right = '20px';
    positionSelect.style.width = '97px';
    positionSelect.style.marginTop = '-2px';

    var directions = ['topLeft', 'top', 'topRight', 'left', 'center', 'right', 'bottomLeft', 'bottom', 'bottomRight'];
    var lset = {'topLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM],
        'top': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM],
        'topRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM],
        'left': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE],
        'center': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE],
        'right': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE],
        'bottomLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP],
        'bottom': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP],
        'bottomRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP]};

    for (var i = 0; i < directions.length; i++)
    {
        var positionOption = document.createElement('option');
        positionOption.setAttribute('value', directions[i]);
        mxUtils.write(positionOption, mxResources.get(directions[i]));
        positionSelect.appendChild(positionOption);
    }

    stylePanel4.appendChild(positionSelect);

    // Writing direction
    var stylePanel5 = stylePanel.cloneNode(false);
    stylePanel5.style.marginLeft = '0px';
    stylePanel5.style.paddingTop = '4px';
    stylePanel5.style.paddingBottom = '4px';
    stylePanel5.style.fontWeight = 'normal';

    mxUtils.write(stylePanel5, mxResources.get('writingDirection'));

    // Adds writing direction options
    // LATER: Handle reselect of same option in all selects (change event
    // is not fired for same option so have opened state on click) and
    // handle multiple different styles for current selection
    var dirSelect = document.createElement('select');
    dirSelect.style.position = 'absolute';
    dirSelect.style.right = '20px';
    dirSelect.style.width = '97px';
    dirSelect.style.marginTop = '-2px';

    // NOTE: For automatic we use the value null since automatic
    // requires the text to be non formatted and non-wrapped
    var dirs = ['automatic', 'leftToRight', 'rightToLeft'];
    var dirSet = {'automatic': null,
        'leftToRight': mxConstants.TEXT_DIRECTION_LTR,
        'rightToLeft': mxConstants.TEXT_DIRECTION_RTL};

    for (var i = 0; i < dirs.length; i++)
    {
        var dirOption = document.createElement('option');
        dirOption.setAttribute('value', dirs[i]);
        mxUtils.write(dirOption, mxResources.get(dirs[i]));
        dirSelect.appendChild(dirOption);
    }

    stylePanel5.appendChild(dirSelect);

    if (!graph.isEditing())
    {
        container.appendChild(stylePanel4);

        mxEvent.addListener(positionSelect, 'change', function(evt)
        {
            graph.getModel().beginUpdate();
            try
            {
                var vals = lset[positionSelect.value];

                if (vals != null)
                {
                    graph.setCellStyles(mxConstants.STYLE_LABEL_POSITION, vals[0], graph.getSelectionCells());
                    graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, vals[1], graph.getSelectionCells());
                    graph.setCellStyles(mxConstants.STYLE_ALIGN, vals[2], graph.getSelectionCells());
                    graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, vals[3], graph.getSelectionCells());
                }
            }
            finally
            {
                graph.getModel().endUpdate();
            }

            mxEvent.consume(evt);
        });

        // LATER: Update dir in text editor while editing and update style with label
        // NOTE: The tricky part is handling and passing on the auto value
        container.appendChild(stylePanel5);

        mxEvent.addListener(dirSelect, 'change', function(evt)
        {
            graph.setCellStyles(mxConstants.STYLE_TEXT_DIRECTION, dirSet[dirSelect.value], graph.getSelectionCells());
            mxEvent.consume(evt);
        });
    }

    // Font size
    var input = document.createElement('input');
    input.style.textAlign = 'right';
    input.style.marginTop = '4px';

    if (!mxClient.IS_QUIRKS)
    {
        input.style.position = 'absolute';
        input.style.right = '32px';
    }

    input.style.width = '46px';
    input.style.height = (mxClient.IS_QUIRKS) ? '21px' : '17px';
    stylePanel2.appendChild(input);

    // Workaround for font size 4 if no text is selected is update font size below
    // after first character was entered (as the font element is lazy created)
    var pendingFontSize = null;

    var inputUpdate = this.installInputHandler(input, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize, 1, 999, ' pt',
        function(fontsize)
        {
            pendingFontSize = fontsize;

            // Workaround for can't set font size in px is to change font size afterwards
            document.execCommand('fontSize', false, '4');
            var elts = graph.cellEditor.textarea.getElementsByTagName('font');

            for (var i = 0; i < elts.length; i++)
            {
                if (elts[i].getAttribute('size') == '4')
                {
                    elts[i].removeAttribute('size');
                    elts[i].style.fontSize = pendingFontSize + 'px';

                    // Overrides fontSize in input with the one just assigned as a workaround
                    // for potential fontSize values of parent elements that don't match
                    window.setTimeout(function()
                    {
                        input.value = pendingFontSize + ' pt';
                        pendingFontSize = null;
                    }, 0);

                    break;
                }
            }
        }, true);

    var stepper = this.createStepper(input, inputUpdate, 1, 10, true, Menus.prototype.defaultFontSize);
    stepper.style.display = input.style.display;
    stepper.style.marginTop = '4px';

    if (!mxClient.IS_QUIRKS)
    {
        stepper.style.right = '20px';
    }

    stylePanel2.appendChild(stepper);

    var arrow = fontMenu.getElementsByTagName('div')[0];
    arrow.style.cssFloat = 'right';

    var bgColorApply = null;
    var currentBgColor = '#ffffff';

    var fontColorApply = null;
    var currentFontColor = '#000000';

    var bgPanel = (graph.cellEditor.isContentEditing()) ? this.createColorOption(mxResources.get('backgroundColor'), function()
        {
            return currentBgColor;
        }, function(color)
        {
            document.execCommand('backcolor', false, (color != mxConstants.NONE) ? color : 'transparent');
        }, '#ffffff',
        {
            install: function(apply) { bgColorApply = apply; },
            destroy: function() { bgColorApply = null; }
        }, null, true) : this.createCellColorOption(mxResources.get('backgroundColor'), mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, '#ffffff');
    bgPanel.style.fontWeight = 'bold';

    var borderPanel = this.createCellColorOption(mxResources.get('borderColor'), mxConstants.STYLE_LABEL_BORDERCOLOR, '#000000');
    borderPanel.style.fontWeight = 'bold';

    var panel = (graph.cellEditor.isContentEditing()) ? this.createColorOption(mxResources.get('fontColor'), function()
        {
            return currentFontColor;
        }, function(color)
        {
            document.execCommand('forecolor', false, (color != mxConstants.NONE) ? color : 'transparent');
        }, '#000000',
        {
            install: function(apply) { fontColorApply = apply; },
            destroy: function() { fontColorApply = null; }
        }, null, true) : this.createCellColorOption(mxResources.get('fontColor'), mxConstants.STYLE_FONTCOLOR, '#000000', function(color)
    {
        if (color == null || color == mxConstants.NONE)
        {
            bgPanel.style.display = 'none';
        }
        else
        {
            bgPanel.style.display = '';
        }

        borderPanel.style.display = bgPanel.style.display;
    }, function(color)
    {
        if (color == null || color == mxConstants.NONE)
        {
            graph.setCellStyles(mxConstants.STYLE_NOLABEL, '1', graph.getSelectionCells());
        }
        else
        {
            graph.setCellStyles(mxConstants.STYLE_NOLABEL, null, graph.getSelectionCells());
        }
    });
    panel.style.fontWeight = 'bold';

    colorPanel.appendChild(panel);
    colorPanel.appendChild(bgPanel);

    if (!graph.cellEditor.isContentEditing())
    {
        colorPanel.appendChild(borderPanel);
    }

    container.appendChild(colorPanel);

    var extraPanel = this.createPanel();
    extraPanel.style.paddingTop = '2px';
    extraPanel.style.paddingBottom = '4px';

    // LATER: Fix toggle using '' instead of 'null'
    var wwOpt = this.createCellOption(mxResources.get('wordWrap'), mxConstants.STYLE_WHITE_SPACE, null, 'wrap', 'null', null, null, true);
    wwOpt.style.fontWeight = 'bold';

    // Word wrap in edge labels only supported via labelWidth style
    if (!ss.containsLabel && !ss.autoSize && ss.edges.length == 0)
    {
        extraPanel.appendChild(wwOpt);
    }

    // Delegates switch of style to formattedText action as it also convertes newlines
    var htmlOpt = this.createCellOption(mxResources.get('formattedText'), 'html', '0',
        null, null, null, ui.actions.get('formattedText'));
    htmlOpt.style.fontWeight = 'bold';
    extraPanel.appendChild(htmlOpt);

    var spacingPanel = this.createPanel();
    spacingPanel.style.paddingTop = '10px';
    spacingPanel.style.paddingBottom = '28px';
    spacingPanel.style.fontWeight = 'normal';

    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('spacing'));
    spacingPanel.appendChild(span);

    var topUpdate, globalUpdate, leftUpdate, bottomUpdate, rightUpdate;
    var topSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function()
    {
        topUpdate.apply(this, arguments);
    });
    var globalSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function()
    {
        globalUpdate.apply(this, arguments);
    });

    mxUtils.br(spacingPanel);
    this.addLabel(spacingPanel, mxResources.get('top'), 91);
    this.addLabel(spacingPanel, mxResources.get('global'), 20);
    mxUtils.br(spacingPanel);
    mxUtils.br(spacingPanel);

    var leftSpacing = this.addUnitInput(spacingPanel, 'pt', 162, 44, function()
    {
        leftUpdate.apply(this, arguments);
    });
    var bottomSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function()
    {
        bottomUpdate.apply(this, arguments);
    });
    var rightSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function()
    {
        rightUpdate.apply(this, arguments);
    });

    mxUtils.br(spacingPanel);
    this.addLabel(spacingPanel, mxResources.get('left'), 162);
    this.addLabel(spacingPanel, mxResources.get('bottom'), 91);
    this.addLabel(spacingPanel, mxResources.get('right'), 20);

    if (!graph.cellEditor.isContentEditing())
    {
        container.appendChild(extraPanel);
        container.appendChild(this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_TEXT_OPACITY));
        container.appendChild(spacingPanel);
    }
    else
    {
        var selState = null;
        var lineHeightInput = null;

        container.appendChild(this.createRelativeOption(mxResources.get('lineheight'), null, null, function(input)
        {
            var value = (input.value == '') ? 120 : parseInt(input.value);
            value = Math.max(120, (isNaN(value)) ? 120 : value);

            if (selState != null)
            {
                graph.cellEditor.restoreSelection(selState);
                selState = null;
            }

            var selectedElement = graph.getSelectedElement();
            var node = selectedElement;

            while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
            {
                node = node.parentNode;
            }

            if (node != null && node == graph.cellEditor.textarea && graph.cellEditor.textarea.firstChild != null)
            {
                if (graph.cellEditor.textarea.firstChild.nodeName != 'FONT')
                {
                    graph.cellEditor.textarea.innerHTML = '<font>' + graph.cellEditor.textarea.innerHTML + '</font>';
                }

                node = graph.cellEditor.textarea.firstChild;
            }

            if (node != null && node != graph.cellEditor.textarea)
            {
                node.style.lineHeight = value + '%';
            }

            input.value = value + ' %';
        }, function(input)
        {
            // Used in CSS handler to update current value
            lineHeightInput = input;

            // KNOWN: Arrow up/down clear selection text in quirks/IE 8
            // Text size via arrow button limits to 16 in IE11. Why?
            mxEvent.addListener(input, 'mousedown', function()
            {
                selState = graph.cellEditor.saveSelection();
            });

            mxEvent.addListener(input, 'touchstart', function()
            {
                selState = graph.cellEditor.saveSelection();
            });

            input.value = '120 %';
        }));

        var insertPanel = stylePanel.cloneNode(false);
        insertPanel.style.paddingLeft = '0px';
        var insertBtns = this.editorUi.toolbar.addItems(['link', 'image'], insertPanel, true);

        var btns = [
            this.editorUi.toolbar.addButton('geSprite-horizontalrule', mxResources.get('insertHorizontalRule'),
                function()
                {
                    document.execCommand('inserthorizontalrule', false, null);
                }, insertPanel),
            this.editorUi.toolbar.addMenuFunctionInContainer(insertPanel, 'geSprite-table', mxResources.get('table'), false, mxUtils.bind(this, function(menu)
            {
                this.editorUi.menus.addInsertTableItem(menu);
            }))];
        this.styleButtons(insertBtns);
        this.styleButtons(btns);

        var wrapper2 = this.createPanel();
        wrapper2.style.paddingTop = '10px';
        wrapper2.style.paddingBottom = '10px';
        wrapper2.appendChild(this.createTitle(mxResources.get('insert')));
        wrapper2.appendChild(insertPanel);
        container.appendChild(wrapper2);

        if (mxClient.IS_QUIRKS)
        {
            wrapper2.style.height = '70';
        }

        var tablePanel = stylePanel.cloneNode(false);
        tablePanel.style.paddingLeft = '0px';

        var btns = [
            this.editorUi.toolbar.addButton('geSprite-insertcolumnbefore', mxResources.get('insertColumnBefore'),
                function()
                {
                    try
                    {
                        if (currentTable != null)
                        {
                            graph.selectNode(graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex : 0));
                        }
                    }
                    catch (e)
                    {
                        alert(e);
                    }
                }, tablePanel),
            this.editorUi.toolbar.addButton('geSprite-insertcolumnafter', mxResources.get('insertColumnAfter'),
                function()
                {
                    try
                    {
                        if (currentTable != null)
                        {
                            graph.selectNode(graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex + 1 : -1));
                        }
                    }
                    catch (e)
                    {
                        alert(e);
                    }
                }, tablePanel),
            this.editorUi.toolbar.addButton('geSprite-deletecolumn', mxResources.get('deleteColumn'),
                function()
                {
                    try
                    {
                        if (currentTable != null && tableCell != null)
                        {
                            graph.deleteColumn(currentTable, tableCell.cellIndex);
                        }
                    }
                    catch (e)
                    {
                        alert(e);
                    }
                }, tablePanel),
            this.editorUi.toolbar.addButton('geSprite-insertrowbefore', mxResources.get('insertRowBefore'),
                function()
                {
                    try
                    {
                        if (currentTable != null && tableRow != null)
                        {
                            graph.selectNode(graph.insertRow(currentTable, tableRow.sectionRowIndex));
                        }
                    }
                    catch (e)
                    {
                        alert(e);
                    }
                }, tablePanel),
            this.editorUi.toolbar.addButton('geSprite-insertrowafter', mxResources.get('insertRowAfter'),
                function()
                {
                    try
                    {
                        if (currentTable != null && tableRow != null)
                        {
                            graph.selectNode(graph.insertRow(currentTable, tableRow.sectionRowIndex + 1));
                        }
                    }
                    catch (e)
                    {
                        alert(e);
                    }
                }, tablePanel),
            this.editorUi.toolbar.addButton('geSprite-deleterow', mxResources.get('deleteRow'),
                function()
                {
                    try
                    {
                        if (currentTable != null && tableRow != null)
                        {
                            graph.deleteRow(currentTable, tableRow.sectionRowIndex);
                        }
                    }
                    catch (e)
                    {
                        alert(e);
                    }
                }, tablePanel)];
        this.styleButtons(btns);
        btns[2].style.marginRight = '9px';

        var wrapper3 = this.createPanel();
        wrapper3.style.paddingTop = '10px';
        wrapper3.style.paddingBottom = '10px';
        wrapper3.appendChild(this.createTitle(mxResources.get('table')));
        wrapper3.appendChild(tablePanel);

        if (mxClient.IS_QUIRKS)
        {
            mxUtils.br(container);
            wrapper3.style.height = '70';
        }

        var tablePanel2 = stylePanel.cloneNode(false);
        tablePanel2.style.paddingLeft = '0px';

        var btns = [
            this.editorUi.toolbar.addButton('geSprite-strokecolor', mxResources.get('borderColor'),
                mxUtils.bind(this, function()
                {
                    if (currentTable != null)
                    {
                        // Converts rgb(r,g,b) values
                        var color = currentTable.style.borderColor.replace(
                            /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                            function($0, $1, $2, $3) {
                                return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                            });
                        this.editorUi.pickColor(color, function(newColor)
                        {
                            if (newColor == null || newColor == mxConstants.NONE)
                            {
                                currentTable.removeAttribute('border');
                                currentTable.style.border = '';
                                currentTable.style.borderCollapse = '';
                            }
                            else
                            {
                                currentTable.setAttribute('border', '1');
                                currentTable.style.border = '1px solid ' + newColor;
                                currentTable.style.borderCollapse = 'collapse';
                            }
                        });
                    }
                }), tablePanel2),
            this.editorUi.toolbar.addButton('geSprite-fillcolor', mxResources.get('backgroundColor'),
                mxUtils.bind(this, function()
                {
                    // Converts rgb(r,g,b) values
                    if (currentTable != null)
                    {
                        var color = currentTable.style.backgroundColor.replace(
                            /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                            function($0, $1, $2, $3) {
                                return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                            });
                        this.editorUi.pickColor(color, function(newColor)
                        {
                            if (newColor == null || newColor == mxConstants.NONE)
                            {
                                currentTable.style.backgroundColor = '';
                            }
                            else
                            {
                                currentTable.style.backgroundColor = newColor;
                            }
                        });
                    }
                }), tablePanel2),
            this.editorUi.toolbar.addButton('geSprite-fit', mxResources.get('spacing'),
                function()
                {
                    if (currentTable != null)
                    {
                        var value = currentTable.getAttribute('cellPadding') || 0;

                        var dlg = new FilenameDialog(ui, value, mxResources.get('apply'), mxUtils.bind(this, function(newValue)
                        {
                            if (newValue != null && newValue.length > 0)
                            {
                                currentTable.setAttribute('cellPadding', newValue);
                            }
                            else
                            {
                                currentTable.removeAttribute('cellPadding');
                            }
                        }), mxResources.get('spacing'));
                        ui.showDialog(dlg.container, 300, 80, true, true);
                        dlg.init();
                    }
                }, tablePanel2),
            this.editorUi.toolbar.addButton('geSprite-left', mxResources.get('left'),
                function()
                {
                    if (currentTable != null)
                    {
                        currentTable.setAttribute('align', 'left');
                    }
                }, tablePanel2),
            this.editorUi.toolbar.addButton('geSprite-center', mxResources.get('center'),
                function()
                {
                    if (currentTable != null)
                    {
                        currentTable.setAttribute('align', 'center');
                    }
                }, tablePanel2),
            this.editorUi.toolbar.addButton('geSprite-right', mxResources.get('right'),
                function()
                {
                    if (currentTable != null)
                    {
                        currentTable.setAttribute('align', 'right');
                    }
                }, tablePanel2)];
        this.styleButtons(btns);
        btns[2].style.marginRight = '9px';

        if (mxClient.IS_QUIRKS)
        {
            mxUtils.br(wrapper3);
            mxUtils.br(wrapper3);
        }

        wrapper3.appendChild(tablePanel2);
        container.appendChild(wrapper3);

        tableWrapper = wrapper3;
    }

    function setSelected(elt, selected)
    {
        if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10))
        {
            elt.style.filter = (selected) ? 'progid:DXImageTransform.Microsoft.Gradient('+
                'StartColorStr=\'#c5ecff\', EndColorStr=\'#87d4fb\', GradientType=0)' : '';
        }
        else
        {
            elt.style.backgroundImage = (selected) ? 'linear-gradient(#c5ecff 0px,#87d4fb 100%)' : '';
        }
    };

    var listener = mxUtils.bind(this, function(sender, evt, force)
    {
        ss = this.format.getSelectionState();
        var fontStyle = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSTYLE, 0);
        setSelected(fontStyleItems[0], (fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD);
        setSelected(fontStyleItems[1], (fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC);
        setSelected(fontStyleItems[2], (fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE);
        fontMenu.firstChild.nodeValue = mxUtils.htmlEntities(mxUtils.getValue(ss.style, mxConstants.STYLE_FONTFAMILY, Menus.prototype.defaultFont));

        setSelected(verticalItem, mxUtils.getValue(ss.style, mxConstants.STYLE_HORIZONTAL, '1') == '0');

        if (force || document.activeElement != input)
        {
            var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize));
            input.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
        }

        var align = mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
        setSelected(left, align == mxConstants.ALIGN_LEFT);
        setSelected(center, align == mxConstants.ALIGN_CENTER);
        setSelected(right, align == mxConstants.ALIGN_RIGHT);

        var valign = mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
        setSelected(top, valign == mxConstants.ALIGN_TOP);
        setSelected(middle, valign == mxConstants.ALIGN_MIDDLE);
        setSelected(bottom, valign == mxConstants.ALIGN_BOTTOM);

        var pos = mxUtils.getValue(ss.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
        var vpos =  mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);

        if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_TOP)
        {
            positionSelect.value = 'topLeft';
        }
        else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_TOP)
        {
            positionSelect.value = 'top';
        }
        else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_TOP)
        {
            positionSelect.value = 'topRight';
        }
        else if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_BOTTOM)
        {
            positionSelect.value = 'bottomLeft';
        }
        else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_BOTTOM)
        {
            positionSelect.value = 'bottom';
        }
        else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_BOTTOM)
        {
            positionSelect.value = 'bottomRight';
        }
        else if (pos == mxConstants.ALIGN_LEFT)
        {
            positionSelect.value = 'left';
        }
        else if (pos == mxConstants.ALIGN_RIGHT)
        {
            positionSelect.value = 'right';
        }
        else
        {
            positionSelect.value = 'center';
        }

        var dir = mxUtils.getValue(ss.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION);

        if (dir == mxConstants.TEXT_DIRECTION_RTL)
        {
            dirSelect.value = 'rightToLeft';
        }
        else if (dir == mxConstants.TEXT_DIRECTION_LTR)
        {
            dirSelect.value = 'leftToRight';
        }
        else if (dir == mxConstants.TEXT_DIRECTION_AUTO)
        {
            dirSelect.value = 'automatic';
        }

        if (force || document.activeElement != globalSpacing)
        {
            var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING, 2));
            globalSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
        }

        if (force || document.activeElement != topSpacing)
        {
            var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_TOP, 0));
            topSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
        }

        if (force || document.activeElement != rightSpacing)
        {
            var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_RIGHT, 0));
            rightSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
        }

        if (force || document.activeElement != bottomSpacing)
        {
            var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_BOTTOM, 0));
            bottomSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
        }

        if (force || document.activeElement != leftSpacing)
        {
            var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_LEFT, 0));
            leftSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
        }
    });

    globalUpdate = this.installInputHandler(globalSpacing, mxConstants.STYLE_SPACING, 2, -999, 999, ' pt');
    topUpdate = this.installInputHandler(topSpacing, mxConstants.STYLE_SPACING_TOP, 0, -999, 999, ' pt');
    rightUpdate = this.installInputHandler(rightSpacing, mxConstants.STYLE_SPACING_RIGHT, 0, -999, 999, ' pt');
    bottomUpdate = this.installInputHandler(bottomSpacing, mxConstants.STYLE_SPACING_BOTTOM, 0, -999, 999, ' pt');
    leftUpdate = this.installInputHandler(leftSpacing, mxConstants.STYLE_SPACING_LEFT, 0, -999, 999, ' pt');

    this.addKeyHandler(input, listener);
    this.addKeyHandler(globalSpacing, listener);
    this.addKeyHandler(topSpacing, listener);
    this.addKeyHandler(rightSpacing, listener);
    this.addKeyHandler(bottomSpacing, listener);
    this.addKeyHandler(leftSpacing, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
    listener();

    if (graph.cellEditor.isContentEditing())
    {
        var updating = false;

        var updateCssHandler = function()
        {
            if (!updating)
            {
                updating = true;

                window.setTimeout(function()
                {
                    var selectedElement = graph.getSelectedElement();
                    var node = selectedElement;

                    while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
                    {
                        node = node.parentNode;
                    }

                    if (node != null)
                    {
                        var css = mxUtils.getCurrentStyle(node);

                        if (css != null)
                        {
                            setSelected(fontStyleItems[0], css.fontWeight == 'bold' || graph.getParentByName(node, 'B', graph.cellEditor.textarea) != null);
                            setSelected(fontStyleItems[1], css.fontStyle == 'italic' || graph.getParentByName(node, 'I', graph.cellEditor.textarea) != null);
                            setSelected(fontStyleItems[2], graph.getParentByName(node, 'U', graph.cellEditor.textarea) != null);
                            setSelected(left, css.textAlign == 'left');
                            setSelected(center, css.textAlign == 'center');
                            setSelected(right, css.textAlign == 'right');
                            setSelected(full, css.textAlign == 'justify');
                            setSelected(sup, graph.getParentByName(node, 'SUP', graph.cellEditor.textarea) != null);
                            setSelected(sub, graph.getParentByName(node, 'SUB', graph.cellEditor.textarea) != null);

                            currentTable = graph.getParentByName(node, 'TABLE', graph.cellEditor.textarea);
                            tableRow = (currentTable == null) ? null : graph.getParentByName(node, 'TR', currentTable);
                            tableCell = (currentTable == null) ? null : graph.getParentByName(node, 'TD', currentTable);
                            tableWrapper.style.display = (currentTable != null) ? '' : 'none';

                            if (document.activeElement != input)
                            {
                                if (node.nodeName == 'FONT' && node.getAttribute('size') == '4' &&
                                    pendingFontSize != null)
                                {
                                    node.removeAttribute('size');
                                    node.style.fontSize = pendingFontSize + 'px';
                                    pendingFontSize = null;
                                }
                                else
                                {
                                    input.value = parseFloat(css.fontSize) + ' pt';
                                }

                                var tmp = node.style.lineHeight || css.lineHeight;
                                var lh = parseFloat(tmp);

                                if (tmp.substring(tmp.length - 2) == 'px')
                                {
                                    lh = lh / parseFloat(css.fontSize);
                                }

                                if (tmp.substring(tmp.length - 1) != '%')
                                {
                                    lh *= 100;
                                }

                                lineHeightInput.value = lh + ' %';
                            }

                            // Converts rgb(r,g,b) values
                            var color = css.color.replace(
                                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                                function($0, $1, $2, $3) {
                                    return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                                });
                            var color2 = css.backgroundColor.replace(
                                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                                function($0, $1, $2, $3) {
                                    return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                                });

                            // Updates the color picker for the current font
                            if (fontColorApply != null)
                            {
                                if (color.charAt(0) == '#')
                                {
                                    currentFontColor = color;
                                }
                                else
                                {
                                    currentFontColor = '#000000';
                                }

                                fontColorApply(currentFontColor, true);
                            }

                            if (bgColorApply != null)
                            {
                                if (color2.charAt(0) == '#')
                                {
                                    currentBgColor = color2;
                                }
                                else
                                {
                                    currentBgColor = null;
                                }

                                bgColorApply(currentBgColor, true);
                            }

                            // Workaround for firstChild is null or not an object
                            // in the log which seems to be IE8- only / 29.01.15
                            if (fontMenu.firstChild != null)
                            {
                                // Strips leading and trailing quotes
                                var ff = css.fontFamily;

                                if (ff.charAt(0) == '\'')
                                {
                                    ff = ff.substring(1);
                                }

                                if (ff.charAt(ff.length - 1) == '\'')
                                {
                                    ff = ff.substring(0, ff.length - 1);
                                }

                                fontMenu.firstChild.nodeValue = ff;
                            }
                        }
                    }

                    updating = false;
                }, 0);
            }
        };

        mxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler)
        mxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler);
        mxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler);
        mxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler);
        this.listeners.push({destroy: function()
            {
                // No need to remove listener since textarea is destroyed after edit
            }});
        updateCssHandler();
    }

    return container;
};
