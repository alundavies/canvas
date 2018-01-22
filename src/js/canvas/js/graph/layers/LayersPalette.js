var LayersPalette = function(editorUi, x, y, w, h)
{
    var graph = editorUi.editor.graph;

    this.layersDiv = document.createElement('div');
    this.layersDiv.style.userSelect = 'none';
    this.layersDiv.style.background = 'whiteSmoke';
    this.layersDiv.style.border = '1px solid whiteSmoke';
    this.layersDiv.style.marginBottom = '10px';
    this.layersDiv.style.overflow = 'auto';

    var tbarHeight = (!EditorUi.compactUi) ? '30px' : '26px';

    var listDiv = document.createElement('div')
    listDiv.style.backgroundColor = '#e5e5e5';
    listDiv.style.overflow = 'auto';
    listDiv.style.left = '0px';
    listDiv.style.right = '0px';

    this.layersDiv.appendChild(listDiv);

    var dragSource = null;
    var dropIndex = null;

    mxEvent.addListener(this.layersDiv, 'dragover', function(evt)
    {
        evt.dataTransfer.dropEffect = 'move';
        dropIndex = 0;
        evt.stopPropagation();
        evt.preventDefault();
    });

    // Workaround for "no element found" error in FF
    mxEvent.addListener(this.layersDiv, 'drop', function(evt)
    {
        evt.stopPropagation();
        evt.preventDefault();
    });

    var layerCount = null;
    var selectionLayer = null;

    var layersToolbar = document.createElement('div');
    layersToolbar.className = 'geToolbarContainer';
    layersToolbar.style.position = 'relative';
    layersToolbar.style.marginTop = '0.4em';
    layersToolbar.style.bottom = '0px';
    layersToolbar.style.left = '0px';
    layersToolbar.style.right = '0px';
    layersToolbar.style.height = tbarHeight;
    layersToolbar.style.overflow = 'hidden';
    layersToolbar.style.padding = (!EditorUi.compactUi) ? '1px' : '4px 0px 3px 0px';
    layersToolbar.style.backgroundColor = 'whiteSmoke';
    layersToolbar.style.borderWidth = '1px 0px 0px 0px';
    layersToolbar.style.borderColor = '#c3c3c3';
    layersToolbar.style.borderStyle = 'solid';
    layersToolbar.style.display = 'block';
    layersToolbar.style.whiteSpace = 'nowrap';

    if (mxClient.IS_QUIRKS)
    {
        layersToolbar.style.filter = 'none';
    }

    var link = document.createElement('a');
    link.className = 'geButton';

    if (mxClient.IS_QUIRKS)
    {
        link.style.filter = 'none';
    }

    var removeLink = link.cloneNode();
    removeLink.innerHTML = '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';

    mxEvent.addListener(removeLink, 'click', function(evt)
    {
        if (graph.isEnabled())
        {
            graph.model.beginUpdate();
            try
            {
                var index = graph.model.root.getIndex(selectionLayer);
                graph.removeCells([selectionLayer], false);

                // Creates default layer if no layer exists
                if (graph.model.getChildCount(graph.model.root) == 0)
                {
                    graph.model.add(graph.model.root, new mxCell());
                    graph.setDefaultParent(null);
                }
                else if (index > 0 && index <= graph.model.getChildCount(graph.model.root))
                {
                    graph.setDefaultParent(graph.model.getChildAt(graph.model.root, index - 1));
                }
                else
                {
                    graph.setDefaultParent(null);
                }
            }
            finally
            {
                graph.model.endUpdate();
            }
        }

        mxEvent.consume(evt);
    });

    if (!graph.isEnabled())
    {
        removeLink.className = 'geButton mxDisabled';
    }

    layersToolbar.appendChild(removeLink);

    var insertLink = link.cloneNode();
    insertLink.innerHTML = '<div class="geSprite geSprite-insert" style="display:inline-block;"></div>';

    mxEvent.addListener(insertLink, 'click', function(evt)
    {
        if (graph.isEnabled() && !graph.isSelectionEmpty())
        {
            graph.moveCells(graph.getSelectionCells(), 0, 0, false, selectionLayer);
        }
    });

    layersToolbar.appendChild(insertLink);

    var renameLink = link.cloneNode();
    renameLink.innerHTML = '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';
    renameLink.setAttribute('title', mxResources.get('rename'));

    function renameLayer(layer)
    {
        if (graph.isEnabled() && layer != null)
        {
            var dlg = new FilenameDialog(editorUi, layer.value || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function(newValue)
            {
                if (newValue != null)
                {
                    graph.getModel().setValue(layer, newValue);
                }
            }), mxResources.get('enterName'));
            editorUi.showDialog(dlg.container, 300, 100, true, true);
            dlg.init();
        }
    };

    mxEvent.addListener(renameLink, 'click', function(evt)
    {
        if (graph.isEnabled())
        {
            renameLayer(selectionLayer);
        }

        mxEvent.consume(evt);
    });

    if (!graph.isEnabled())
    {
        renameLink.className = 'geButton mxDisabled';
    }

    layersToolbar.appendChild(renameLink);

    var duplicateLink = link.cloneNode();
    duplicateLink.innerHTML = '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>';

    mxEvent.addListener(duplicateLink, 'click', function(evt)
    {
        if (graph.isEnabled())
        {
            var newCell = null;
            graph.model.beginUpdate();
            try
            {
                newCell = graph.cloneCells([selectionLayer])[0];
                newCell.value = mxResources.get('untitledLayer');
                newCell.setVisible(true);
                newCell = graph.addCell(newCell, graph.model.root);
                graph.setDefaultParent(newCell);
            }
            finally
            {
                graph.model.endUpdate();
            }

            if (newCell != null && !graph.isCellLocked(newCell))
            {
                graph.selectAll(newCell);
            }
        }
    });

    if (!graph.isEnabled())
    {
        duplicateLink.className = 'geButton mxDisabled';
    }

    layersToolbar.appendChild(duplicateLink);

    var addLink = link.cloneNode();
    addLink.innerHTML = '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
    addLink.setAttribute('title', mxResources.get('addLayer'));

    mxEvent.addListener(addLink, 'click', function(evt)
    {
        if (graph.isEnabled())
        {
            graph.model.beginUpdate();

            try
            {
                var cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')), graph.model.root);
                graph.setDefaultParent(cell);
            }
            finally
            {
                graph.model.endUpdate();
            }
        }

        mxEvent.consume(evt);
    });

    if (!graph.isEnabled())
    {
        addLink.className = 'geButton mxDisabled';
    }

    layersToolbar.appendChild(addLink);

    this.layersDiv.appendChild(layersToolbar);

    function refresh()
    {
        layerCount = graph.model.getChildCount(graph.model.root)
        listDiv.innerHTML = '';

        function addLayer(index, label, child, defaultParent)
        {
            var ldiv = document.createElement('div');
            ldiv.className = 'geToolbarContainer';

            ldiv.style.overflow = 'hidden';
            ldiv.style.position = 'relative';
            ldiv.style.padding = '4px';
            ldiv.style.height = '22px';
            ldiv.style.display = 'block';
            ldiv.style.backgroundColor = 'whiteSmoke';
            ldiv.style.borderWidth = '0px 0px 1px 0px';
            ldiv.style.borderColor = '#c3c3c3';
            ldiv.style.borderStyle = 'solid';
            ldiv.style.whiteSpace = 'nowrap';

            var left = document.createElement('div');
            left.style.display = 'inline-block';
            left.style.width = '100%';
            left.style.textOverflow = 'ellipsis';
            left.style.overflow = 'hidden';

            mxEvent.addListener(ldiv, 'dragover', function(evt)
            {
                evt.dataTransfer.dropEffect = 'move';
                dropIndex = index;
                evt.stopPropagation();
                evt.preventDefault();
            });

            mxEvent.addListener(ldiv, 'dragstart', function(evt)
            {
                dragSource = ldiv;

                // Workaround for no DnD on DIV in FF
                if (mxClient.IS_FF)
                {
                    // LATER: Check what triggers a parse as XML on this in FF after drop
                    evt.dataTransfer.setData('Text', '<layer/>');
                }
            });

            mxEvent.addListener(ldiv, 'dragend', function(evt)
            {
                if (dragSource != null && dropIndex != null)
                {
                    graph.addCell(child, graph.model.root, dropIndex);
                }

                dragSource = null;
                dropIndex = null;
                evt.stopPropagation();
                evt.preventDefault();
            });

            var btn = document.createElement('img');
            btn.setAttribute('draggable', 'false');
            btn.setAttribute('align', 'top');
            btn.setAttribute('border', '0');
            btn.style.cursor = 'pointer';
            btn.style.padding = '4px';
            btn.setAttribute('title', mxResources.get('lockUnlock'));

            var state = graph.view.getState(child);
            var style = (state != null) ? state.style : graph.getCellStyle(child);

            if (mxUtils.getValue(style, 'locked', '0') == '1')
            {
                btn.setAttribute('src', Dialog.prototype.lockedImage);
            }
            else
            {
                btn.setAttribute('src', Dialog.prototype.unlockedImage);
            }

            mxEvent.addListener(btn, 'click', function(evt)
            {
                if (graph.isEnabled())
                {
                    var value = null;
                    graph.getModel().beginUpdate();
                    try
                    {
                        value = (mxUtils.getValue(style, 'locked', '0') == '1') ? null : '1';
                        graph.setCellStyles('locked', value, [child]);
                    }
                    finally
                    {
                        graph.getModel().endUpdate();
                    }

                    if (value == '1')
                    {
                        graph.removeSelectionCells(graph.getModel().getDescendants(child));
                    }

                    mxEvent.consume(evt);
                }
            });

            left.appendChild(btn);

            var inp = document.createElement('input');
            inp.setAttribute('type', 'checkbox');
            inp.setAttribute('title', mxResources.get('hideIt', [child.value || mxResources.get('background')]));
            inp.style.marginLeft = '4px';
            inp.style.marginRight = '6px';
            inp.style.marginTop = '4px';
            left.appendChild(inp);

            if (!graph.isEnabled())
            {
                inp.setAttribute('disabled', 'disabled');
            }

            if (graph.model.isVisible(child))
            {
                inp.setAttribute('checked', 'checked');
                inp.defaultChecked = true;
            }

            mxEvent.addListener(inp, 'click', function(evt)
            {
                if (graph.isEnabled())
                {
                    graph.model.setVisible(child, !graph.model.isVisible(child));
                    mxEvent.consume(evt);
                }
            });

            mxUtils.write(left, label);
            ldiv.appendChild(left);

            if (graph.isEnabled())
            {
                // Fallback if no drag and drop is available
                if (mxClient.IS_TOUCH || mxClient.IS_POINTER || mxClient.IS_VML ||
                    (mxClient.IS_IE && document.documentMode < 10))
                {
                    var right = document.createElement('div');
                    right.style.display = 'block';
                    right.style.textAlign = 'right';
                    right.style.whiteSpace = 'nowrap';
                    right.style.position = 'absolute';
                    right.style.right = '6px';
                    right.style.top = '6px';

                    // Poor man's change layer order
                    if (index > 0)
                    {
                        var img2 = document.createElement('a');

                        img2.setAttribute('title', mxResources.get('toBack'));

                        img2.className = 'geButton';
                        img2.style.cssFloat = 'none';
                        img2.innerHTML = '&#9660;';
                        img2.style.width = '14px';
                        img2.style.height = '14px';
                        img2.style.fontSize = '14px';
                        img2.style.margin = '0px';
                        img2.style.marginTop = '-1px';
                        right.appendChild(img2);

                        mxEvent.addListener(img2, 'click', function(evt)
                        {
                            if (graph.isEnabled())
                            {
                                graph.addCell(child, graph.model.root, index - 1);
                            }

                            mxEvent.consume(evt);
                        });
                    }

                    if (index >= 0 && index < layerCount - 1)
                    {
                        var img1 = document.createElement('a');

                        img1.setAttribute('title', mxResources.get('toFront'));

                        img1.className = 'geButton';
                        img1.style.cssFloat = 'none';
                        img1.innerHTML = '&#9650;';
                        img1.style.width = '14px';
                        img1.style.height = '14px';
                        img1.style.fontSize = '14px';
                        img1.style.margin = '0px';
                        img1.style.marginTop = '-1px';
                        right.appendChild(img1);

                        mxEvent.addListener(img1, 'click', function(evt)
                        {
                            if (graph.isEnabled())
                            {
                                graph.addCell(child, graph.model.root, index + 1);
                            }

                            mxEvent.consume(evt);
                        });
                    }

                    ldiv.appendChild(right);
                }

                if (mxClient.IS_SVG && (!mxClient.IS_IE || document.documentMode >= 10))
                {
                    ldiv.setAttribute('draggable', 'true');
                    ldiv.style.cursor = 'move';
                }
            }

            mxEvent.addListener(ldiv, 'dblclick', function(evt)
            {
                var nodeName = mxEvent.getSource(evt).nodeName;

                if (nodeName != 'INPUT' && nodeName != 'IMG')
                {
                    renameLayer(child);
                    mxEvent.consume(evt);
                }
            });

            if (graph.getDefaultParent() == child)
            {
                ldiv.style.background = '#e6eff8';
                ldiv.style.fontWeight = 'bold';
                selectionLayer = child;
            }
            else
            {
                mxEvent.addListener(ldiv, 'click', function(evt)
                {
                    if (graph.isEnabled())
                    {
                        graph.setDefaultParent(defaultParent);
                        graph.view.setCurrentRoot(null);
                        refresh();
                    }
                });
            }

            listDiv.appendChild(ldiv);
        };

        // Cannot be moved or deleted
        for (var i = layerCount - 1; i >= 0; i--)
        {
            (mxUtils.bind(this, function(child)
            {
                addLayer(i, child.value || mxResources.get('background'), child, child);
            }))(graph.model.getChildAt(graph.model.root, i));
        }

        removeLink.setAttribute('title', mxResources.get('removeIt', [selectionLayer.value || mxResources.get('background')]));
        insertLink.setAttribute('title', mxResources.get('moveSelectionTo', [selectionLayer.value || mxResources.get('background')]));
        duplicateLink.setAttribute('title', mxResources.get('duplicateIt', [selectionLayer.value || mxResources.get('background')]));
        renameLink.setAttribute('title', mxResources.get('renameIt', [selectionLayer.value || mxResources.get('background')]));

        if (graph.isSelectionEmpty())
        {
            insertLink.className = 'geButton mxDisabled';
        }
    };

    refresh();
    graph.model.addListener(mxEvent.CHANGE, function()
    {
        refresh();
    });

    graph.selectionModel.addListener(mxEvent.CHANGE, function()
    {
        if (graph.isSelectionEmpty())
        {
            insertLink.className = 'geButton mxDisabled';
        }
        else
        {
            insertLink.className = 'geButton';
        }
    });

    // Make refresh available via instance
    this.refreshLayers = refresh;

};
