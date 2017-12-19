var sharp = require( 'sharp');
var urls = require( '../capture/urls.js').urls;

for( var url of urls){

    sharp( `../capture/images/${url.name}.png`)
        .png()
        .tile()
        .toFile(`${url.name}.dz`, (err, info) => console.log( err) );
}
