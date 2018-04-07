
let zoomer = new Zoomer();
zoomer.init();
// Extends EditorUi to update I/O action states based on availability of backend
(function()
{

    // Adds required resources (disables loading of fallback properties, this can only
    // be used if we know that all keys are defined in the language specific file)
    mxResources.loadDefaultBundle = false;
    var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
        mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

    // Fixes possible asynchronous requests
    mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function(xhr) {

        // Adds bundle text to resources
        mxResources.parse(xhr[0].getText());

        // Configures the default graph theme
        var themes = new Object();
        themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

        // Main
        window.editor = new Editor(urlParams['chrome'] == '0', themes);
        window.editorUI = new EditorUi( editor);

        window.editorUI.saveRemotely = function( filename, xml) {
            socket.emit( 'request-save-drawing', { filename, xml});
        };

        /* socket.on('available-drawings', function( data) {
         console.log(data);
         }); */

        // Send log messages to server for logging
        console.oldLog = console.log;

        /*  console.log=function( msg){
         console.oldLog.call( console, arguments);
         socket.emit( 'log', msg);
         };*/


        socket.on( 'response-drawing', function( data){
            window.editorUI.openXml( data.xml, data.filename);

            window.editor.graph.fit();

            // don't want failures here stopping graph from showing

        });

        socket.emit( 'request-drawing', {filename: 'main.xml'} );

    }, function()
    {
        document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
    });
})();
