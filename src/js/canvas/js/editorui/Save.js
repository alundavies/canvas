/**
 * Saves the current graph under the given filename.
 */
EditorUi.prototype.saveRemotely= function( filename, xml){
    new mxXmlRequest(SAVE_URL+'/'+filename, 'filename=' + filename +
        '&xml=' + encodeURIComponent(xml)).simulate(document /*, '_blank'*/);
};

EditorUi.prototype.save = function(name)
{
    if (name != null)
    {
        if (this.editor.graph.isEditing())
        {
            this.editor.graph.stopEditing();
        }

        var xml = mxUtils.getXml(this.editor.getGraphXml());

        try
        {
            if (Editor.useLocalStorage)
            {
                if (localStorage.getItem(name) != null &&
                    !mxUtils.confirm(mxResources.get('replaceIt', [name])))
                {
                    return;
                }

                localStorage.setItem(name, xml);
                this.editor.setStatus(mxUtils.htmlEntities(mxResources.get('saved')) + ' ' + new Date());
            }
            else
            {
                if (xml.length < MAX_REQUEST_SIZE)
                {
                    let filename = encodeURIComponent(name);
                    this.saveRemotely( filename, xml);
                }
                else
                {
                    mxUtils.alert(mxResources.get('drawingTooLarge'));
                    mxUtils.popup(xml);

                    return;
                }
            }

            this.editor.setModified(false);
            this.editor.setFilename(name);
            this.updateDocumentTitle();
        }
        catch (e)
        {
            this.editor.setStatus(mxUtils.htmlEntities(mxResources.get('errorSavingFile')));
        }
    }
};
