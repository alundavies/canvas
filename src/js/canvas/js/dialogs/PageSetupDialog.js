
/**
 * Constructs a new page setup dialog.
 */
var PageSetupDialog = function(editorUi)
{
    var graph = editorUi.editor.graph;
    var row, td;

    var table = document.createElement('table');
    table.style.width = '100%';
    table.style.height = '100%';
    var tbody = document.createElement('tbody');

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.verticalAlign = 'top';
    td.style.fontSize = '10pt';
    mxUtils.write(td, mxResources.get('paperSize') + ':');

    row.appendChild(td);

    td = document.createElement('td');
    td.style.verticalAlign = 'top';
    td.style.fontSize = '10pt';

    var accessor = PageSetupDialog.addPageFormatPanel(td, 'pagesetupdialog', graph.pageFormat);

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement('tr');

    td = document.createElement('td');
    mxUtils.write(td, mxResources.get('background') + ':');

    row.appendChild(td);

    td = document.createElement('td');
    td.style.whiteSpace = 'nowrap';

    var backgroundInput = document.createElement('input');
    backgroundInput.setAttribute('type', 'text');
    var backgroundButton = document.createElement('button');

    backgroundButton.style.width = '18px';
    backgroundButton.style.height = '18px';
    backgroundButton.style.marginRight = '20px';
    backgroundButton.style.backgroundPosition = 'center center';
    backgroundButton.style.backgroundRepeat = 'no-repeat';

    var newBackgroundColor = graph.background;

    function updateBackgroundColor()
    {
        if (newBackgroundColor == null || newBackgroundColor == mxConstants.NONE)
        {
            backgroundButton.style.backgroundColor = '';
            backgroundButton.style.backgroundImage = 'url(\'' + Dialog.prototype.noColorImage + '\')';
        }
        else
        {
            backgroundButton.style.backgroundColor = newBackgroundColor;
            backgroundButton.style.backgroundImage = '';
        }
    };

    updateBackgroundColor();

    mxEvent.addListener(backgroundButton, 'click', function(evt)
    {
        editorUi.pickColor(newBackgroundColor || 'none', function(color)
        {
            newBackgroundColor = color;
            updateBackgroundColor();
        });
        mxEvent.consume(evt);
    });

    td.appendChild(backgroundButton);

    mxUtils.write(td, mxResources.get('gridSize') + ':');

    var gridSizeInput = document.createElement('input');
    gridSizeInput.setAttribute('type', 'number');
    gridSizeInput.setAttribute('min', '0');
    gridSizeInput.style.width = '40px';
    gridSizeInput.style.marginLeft = '6px';

    gridSizeInput.value = graph.getGridSize();
    td.appendChild(gridSizeInput);

    mxEvent.addListener(gridSizeInput, 'change', function()
    {
        var value = parseInt(gridSizeInput.value);
        gridSizeInput.value = Math.max(1, (isNaN(value)) ? graph.getGridSize() : value);
    });

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');

    mxUtils.write(td, mxResources.get('image') + ':');

    row.appendChild(td);
    td = document.createElement('td');

    var changeImageLink = document.createElement('a');
    changeImageLink.style.textDecoration = 'underline';
    changeImageLink.style.cursor = 'pointer';
    changeImageLink.style.color = '#a0a0a0';

    var newBackgroundImage = graph.backgroundImage;

    function updateBackgroundImage()
    {
        if (newBackgroundImage == null)
        {
            changeImageLink.removeAttribute('title');
            changeImageLink.style.fontSize = '';
            changeImageLink.innerHTML = mxResources.get('change') + '...';
        }
        else
        {
            changeImageLink.setAttribute('title', newBackgroundImage.src);
            changeImageLink.style.fontSize = '11px';
            changeImageLink.innerHTML = newBackgroundImage.src.substring(0, 42) + '...';
        }
    };

    mxEvent.addListener(changeImageLink, 'click', function(evt)
    {
        editorUi.showBackgroundImageDialog(function(image)
        {
            newBackgroundImage = image;
            updateBackgroundImage();
        });

        mxEvent.consume(evt);
    });

    updateBackgroundImage();

    td.appendChild(changeImageLink);

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');
    td.colSpan = 2;
    td.style.paddingTop = '16px';
    td.setAttribute('align', 'right');

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
    {
        editorUi.hideDialog();
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst)
    {
        td.appendChild(cancelBtn);
    }

    var applyBtn = mxUtils.button(mxResources.get('apply'), function()
    {
        editorUi.hideDialog();
        editorUi.setPageFormat(accessor.get());

        if (graph.background != newBackgroundColor)
        {
            editorUi.setBackgroundColor(newBackgroundColor);
        }

        if (graph.backgroundImage !== newBackgroundImage)
        {
            editorUi.setBackgroundImage(newBackgroundImage);
        }

        if (graph.gridSize !== gridSizeInput.value)
        {
            graph.setGridSize(parseInt(gridSizeInput.value));
        }
    });
    applyBtn.className = 'geBtn gePrimaryBtn';
    td.appendChild(applyBtn);

    if (!editorUi.editor.cancelFirst)
    {
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);

    table.appendChild(tbody);
    this.container = table;
};

/**
 *
 */
PageSetupDialog.addPageFormatPanel = function(div, namePostfix, pageFormat, pageFormatListener)
{
    var formatName = 'format-' + namePostfix;

    var portraitCheckBox = document.createElement('input');
    portraitCheckBox.setAttribute('name', formatName);
    portraitCheckBox.setAttribute('type', 'radio');
    portraitCheckBox.setAttribute('value', 'portrait');

    var landscapeCheckBox = document.createElement('input');
    landscapeCheckBox.setAttribute('name', formatName);
    landscapeCheckBox.setAttribute('type', 'radio');
    landscapeCheckBox.setAttribute('value', 'landscape');

    var paperSizeSelect = document.createElement('select');
    paperSizeSelect.style.marginBottom = '8px';
    paperSizeSelect.style.width = '202px';

    var formatDiv = document.createElement('div');
    formatDiv.style.marginLeft = '4px';
    formatDiv.style.width = '210px';
    formatDiv.style.height = '24px';

    portraitCheckBox.style.marginRight = '6px';
    formatDiv.appendChild(portraitCheckBox);

    var portraitSpan = document.createElement('span');
    portraitSpan.style.maxWidth = '100px';
    mxUtils.write(portraitSpan, mxResources.get('portrait'));
    formatDiv.appendChild(portraitSpan);

    landscapeCheckBox.style.marginLeft = '10px';
    landscapeCheckBox.style.marginRight = '6px';
    formatDiv.appendChild(landscapeCheckBox);

    var landscapeSpan = document.createElement('span');
    landscapeSpan.style.width = '100px';
    mxUtils.write(landscapeSpan, mxResources.get('landscape'));
    formatDiv.appendChild(landscapeSpan)

    var customDiv = document.createElement('div');
    customDiv.style.marginLeft = '4px';
    customDiv.style.width = '210px';
    customDiv.style.height = '24px';

    var widthInput = document.createElement('input');
    widthInput.setAttribute('size', '6');
    widthInput.setAttribute('value', pageFormat.width);
    customDiv.appendChild(widthInput);
    mxUtils.write(customDiv, ' x ');

    var heightInput = document.createElement('input');
    heightInput.setAttribute('size', '6');
    heightInput.setAttribute('value', pageFormat.height);
    customDiv.appendChild(heightInput);
    mxUtils.write(customDiv, ' pt');

    formatDiv.style.display = 'none';
    customDiv.style.display = 'none';

    var pf = new Object();
    var formats = PageSetupDialog.getFormats();

    for (var i = 0; i < formats.length; i++)
    {
        var f = formats[i];
        pf[f.key] = f;

        var paperSizeOption = document.createElement('option');
        paperSizeOption.setAttribute('value', f.key);
        mxUtils.write(paperSizeOption, f.title);
        paperSizeSelect.appendChild(paperSizeOption);
    }

    var customSize = false;

    function listener(sender, evt, force)
    {
        if (force || (widthInput != document.activeElement && heightInput != document.activeElement))
        {
            var detected = false;

            for (var i = 0; i < formats.length; i++)
            {
                var f = formats[i];

                // Special case where custom was chosen
                if (customSize)
                {
                    if (f.key == 'custom')
                    {
                        paperSizeSelect.value = f.key;
                        customSize = false;
                    }
                }
                else if (f.format != null)
                {
                    if (pageFormat.width == f.format.width && pageFormat.height == f.format.height)
                    {
                        paperSizeSelect.value = f.key;
                        portraitCheckBox.setAttribute('checked', 'checked');
                        portraitCheckBox.defaultChecked = true;
                        portraitCheckBox.checked = true;
                        landscapeCheckBox.removeAttribute('checked');
                        landscapeCheckBox.defaultChecked = false;
                        landscapeCheckBox.checked = false;
                        detected = true;
                    }
                    else if (pageFormat.width == f.format.height && pageFormat.height == f.format.width)
                    {
                        paperSizeSelect.value = f.key;
                        portraitCheckBox.removeAttribute('checked');
                        portraitCheckBox.defaultChecked = false;
                        portraitCheckBox.checked = false;
                        landscapeCheckBox.setAttribute('checked', 'checked');
                        landscapeCheckBox.defaultChecked = true;
                        landscapeCheckBox.checked = true;
                        detected = true;
                    }
                }
            }

            // Selects custom format which is last in list
            if (!detected)
            {
                widthInput.value = pageFormat.width;
                heightInput.value = pageFormat.height;
                paperSizeOption.setAttribute('selected', 'selected');
                portraitCheckBox.setAttribute('checked', 'checked');
                portraitCheckBox.defaultChecked = true;
                formatDiv.style.display = 'none';
                customDiv.style.display = '';
            }
            else
            {
                formatDiv.style.display = '';
                customDiv.style.display = 'none';
            }
        }
    };
    listener();

    div.appendChild(paperSizeSelect);
    mxUtils.br(div);

    div.appendChild(formatDiv);
    div.appendChild(customDiv);

    var currentPageFormat = pageFormat;

    var update = function()
    {
        var f = pf[paperSizeSelect.value];

        if (f.format != null)
        {
            widthInput.value = f.format.width;
            heightInput.value = f.format.height;
            customDiv.style.display = 'none';
            formatDiv.style.display = '';
        }
        else
        {
            formatDiv.style.display = 'none';
            customDiv.style.display = '';
        }

        var newPageFormat = new mxRectangle(0, 0, parseInt(widthInput.value), parseInt(heightInput.value));

        if (paperSizeSelect.value != 'custom' && landscapeCheckBox.checked)
        {
            newPageFormat = new mxRectangle(0, 0, newPageFormat.height, newPageFormat.width);
        }

        if (newPageFormat.width != currentPageFormat.width || newPageFormat.height != currentPageFormat.height)
        {
            currentPageFormat = newPageFormat;

            if (pageFormatListener != null)
            {
                pageFormatListener(currentPageFormat);
            }
        }
    };

    mxEvent.addListener(portraitSpan, 'click', function(evt)
    {
        portraitCheckBox.checked = true;
        update();
        mxEvent.consume(evt);
    });

    mxEvent.addListener(landscapeSpan, 'click', function(evt)
    {
        landscapeCheckBox.checked = true;
        update();
        mxEvent.consume(evt);
    });

    mxEvent.addListener(widthInput, 'blur', update);
    mxEvent.addListener(widthInput, 'click', update);
    mxEvent.addListener(heightInput, 'blur', update);
    mxEvent.addListener(heightInput, 'click', update);
    mxEvent.addListener(landscapeCheckBox, 'change', update);
    mxEvent.addListener(portraitCheckBox, 'change', update);
    mxEvent.addListener(paperSizeSelect, 'change', function()
    {
        // Handles special case where custom was chosen
        customSize = paperSizeSelect.value == 'custom';
        update();
    });

    update();

    return {set: function(value)
        {
            pageFormat = value;
            listener(null, null, true);
        },get: function()
        {
            return currentPageFormat;
        }, widthInput: widthInput,
        heightInput: heightInput};
};

/**
 *
 */
PageSetupDialog.getFormats = function()
{
    return [{key: 'letter', title: 'US-Letter (8,5" x 11")', format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT},
        {key: 'legal', title: 'US-Legal (8,5" x 14")', format: new mxRectangle(0, 0, 850, 1400)},
        {key: 'tabloid', title: 'US-Tabloid (279 mm x 432 mm)', format: new mxRectangle(0, 0, 1100, 1700)},
        {key: 'a3', title: 'A3 (297 mm x 420 mm)', format: new mxRectangle(0, 0, 1169, 1652)},
        {key: 'a4', title: 'A4 (210 mm x 297 mm)', format: mxConstants.PAGE_FORMAT_A4_PORTRAIT},
        {key: 'a5', title: 'A5 (148 mm x 210 mm)', format: new mxRectangle(0, 0, 584, 826)},
        {key: 'custom', title: mxResources.get('custom'), format: null}];
};
