var express = require('express')
var app = express()

app.use(express.static('src'))

app.get('/canvas', function(req, res){
    res.sendfile('index.html', { root: __dirname + "/src" } );
});

app.listen(29000, function () {
    console.log('Canvas listening on port 29000!')
})