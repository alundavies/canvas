
/**
 * Constructs a new textarea dialog.
 */
var TextareaDialog = function(editorUi, title, url, fn, cancelFn, cancelTitle, w, h, addButtons, noHide, noWrap, applyTitle)
{
    w = (w != null) ? w : 300;
    h = (h != null) ? h : 120;
    noHide = (noHide != null) ? noHide : false;
    var row, td;

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    row = document.createElement('tr');

    td = document.createElement('td');
    td.style.fontSize = '10pt';
    td.style.width = '100px';
    mxUtils.write(td, title);

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');

    var nameInput = document.createElement('textarea');

    if (noWrap)
    {
        nameInput.setAttribute('wrap', 'off');
    }

    mxUtils.write(nameInput, url || '');
    nameInput.style.resize = 'none';
    nameInput.style.width = w + 'px';
    nameInput.style.height = h + 'px';

    this.textarea = nameInput;

    this.init = function()
    {
        nameInput.focus();
        nameInput.scrollTop = 0;
    };

    td.appendChild(nameInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement('tr');
    td = document.createElement('td');
    td.style.paddingTop = '14px';
    td.style.whiteSpace = 'nowrap';
    td.setAttribute('align', 'right');

    var cancelBtn = mxUtils.button(cancelTitle || mxResources.get('cancel'), function()
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

    if (addButtons != null)
    {
        addButtons(td);
    }

    if (fn != null)
    {
        var genericBtn = mxUtils.button(applyTitle || mxResources.get('apply'), function()
        {
            if (!noHide)
            {
                editorUi.hideDialog();
            }

            fn(nameInput.value);
        });

        genericBtn.className = 'geBtn gePrimaryBtn';
        td.appendChild(genericBtn);
    }

    if (!editorUi.editor.cancelFirst)
    {
        td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);
    table.appendChild(tbody);
    this.container = table;
};