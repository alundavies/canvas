var express = require('express')
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
var fs = require( 'async-file');
//var engines = require('consolidate')
var app = express()

var server = require('http').Server(app);
var io = require('socket.io')(server);


app.set('views', 'src/views');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views'
}));

//app.engine( 'handlebars', engines.handlebars)
//app.engine( 'html', engines.handlebars)

app.set('view engine', 'handlebars');

app.use( '/canvas', express.static('src'))

app.post( '/canvas/open.html', function( req, res){
    console.log( req)
    res.send('<html><body>Hello</body></html>')
})

app.post( '/open', function( req, res){
    res.send('<html><body>Hello</body></html>')
})


app.get('/canvas/:canvasId', function(req, res){
    //res.sendfile('index.html', { root: __dirname + "/src" } );
    res.render( req.params['canvasId']);
});

// Return the markup for the particular canvas - a canvas cannot be called load
/*app.get('/canvas/load/:canvasId/:version', function( req, res){
    // version - latest

});*/

app.post( '/canvas/:canvasId', function( req, res){
   console.log( req.params[ 'canvasId']);
     console.log( req.body);
});

var urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '100mb' })



app.post( '/canvas/drawings/:filename', urlencodedParser, async function( req, res){
    console.log( req.body);
    xml = req.body.xml;
    xml = decodeURIComponent( xml);
    console.log( xml);
    try
    {
        await fs.writeFile( 'saved/'+req.params['filename'], xml);
        console.log( 'Saved file '+req.params['filename']);
    } catch( e){
        console.error( e);
    }
    res.send( 'OK')
});

server.listen(29000, function () {
    console.log('Canvas listening on port 29000!')
});

var blueprintNamespace = io.of( '/blueprint');

blueprintNamespace.on('connection', async function (socket) {

    socket.on( 'request-drawing', async function( data){
        console.log( `Drawing requested ${data.filename}`);
        let mainXml = (await fs.readFile( `saved/${data.filename}`)).toString();
        socket.emit('response-drawing', { xml: mainXml, filename: data.filename });
    });

    socket.on( 'request-save-drawing', async function( data){
        console.log( `Save Drawing requested ${data.filename}`);
        console.log( data.xml);
        xml = data.xml;
        xml = decodeURIComponent( xml);
        console.log( xml);
        try
        {
            await fs.writeFile( 'saved/'+data.filename, xml);
            console.log( 'Saved file over socket.io: '+data.filename);
        } catch( e){
            console.error( e);
        }
        socket.emit( 'response-save-drawing', {success:true});
    });


    socket.on('log', function (data) {
        console.log( 'CLIENT: ' + data);
    });

});









