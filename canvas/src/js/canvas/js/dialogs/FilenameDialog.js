
/**
 * Constructs a new filename dialog.
 */
var FilenameDialog = function(editorUi, filename, buttonText, fn, label, validateFn, content, helpLink, closeOnBtn, cancelFn)
{
    closeOnBtn = (closeOnBtn != null) ? closeOnBtn : true;
    var row, td;

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    table.style.marginTop = '8px';

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.whiteSpace = 'nowrap';
    td.style.fontSize = '10pt';
    td.style.width = '120px';
    mxUtils.write(td, (label || mxResources.get('filename')) + ':');

    row.appendChild(td);

    var nameInput = document.createElement('input');
    nameInput.setAttribute('value', filename || '');
    nameInput.style.marginLeft = '4px';
    nameInput.style.width = '180px';

    var genericBtn = mxUtils.button(buttonText, function()
    {
        if (validateFn == null || validateFn(nameInput.value))
        {
            if (closeOnBtn)
            {
                editorUi.hideDialog();
            }

            fn(nameInput.value);
        }
    });
    genericBtn.className = 'geBtn gePrimaryBtn';

    this.init = function()
    {
        if (label == null && content != null)
        {
            return;
        }

        nameInput.focus();

        if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
        {
            nameInput.select();
        }
        else
        {
            document.execCommand('selectAll', false, null);
        }

        // Installs drag and drop handler for links
        if (Graph.fileSupport)
        {
            // Setup the dnd listeners
            var dlg = table.parentNode;
            var graph = editorUi.editor.graph;
            var dropElt = null;

            mxEvent.addListener(dlg, 'dragleave', function(evt)
            {
                if (dropElt != null)
                {
                    dropElt.style.backgroundColor = '';
                    dropElt = null;
                }

                evt.stopPropagation();
                evt.preventDefault();
            });

            mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
            {
                // IE 10 does not implement pointer-events so it can't have a drop highlight
                if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
                {
                    dropElt = nameInput;
                    dropElt.style.backgroundColor = '#ebf2f9';
                }

                evt.stopPropagation();
                evt.preventDefault();
            }));

            mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
            {
                if (dropElt != null)
                {
                    dropElt.style.backgroundColor = '';
                    dropElt = null;
                }

                if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
                {
                    nameInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
                    genericBtn.click();
                }

                evt.stopPropagation();
                evt.preventDefault();
            }));
        }
    };

    td = document.createElement('td');
    td.appendChild(nameInput);
    row.appendChild(td);

    if (label != null || content == null)
    {
        tbody.appendChild(row);
    }

    if (content != null)
    {
        row = document.createElement('tr');
        td = document.createElement('td');
        td.colSpan = 2;
        td.appendChild(content);
        row.appendChild(td);
        tbody.appendChild(row);
    }

    row = document.createElement('tr');
    td = document.createElement('td');
    td.colSpan = 2;
    td.style.paddingTop = '20px';
    td.style.whiteSpace = 'nowrap';
    td.setAttribute('align', 'right');

    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
    {
        editorUi.hideDialog();

        if (cancelFn != null)
        {
            cancelFn();
        }
    });
    cancelBtn.className = 'geBtn';

    if (editorUi.editor.cancelFirst)
    {
        td.appendChild(cancelBtn);
    }

    if (helpLink != null)
    {
        var helpBtn = mxUtils.button(mxResources.get('help'), function()
        {
            window.open(helpLink);
        });

        helpBtn.className = 'geBtn';
        td.appendChild(helpBtn);
    }

    mxEvent.addListener(nameInput, 'keypress', function(e)
    {
        if (e.keyCode == 13)
        {
            genericBtn.click();
        }
    });

    td.appendChild(genericBtn);

    if (!editorUi.editor.cancelFirst)
    {
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);
    table.appendChild(tbody);

    this.container = table;
};
