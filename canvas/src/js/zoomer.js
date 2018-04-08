class Zoomer {

    constructor() {}

    init() {

        var mapEdge = 1;
        var tileSize = 256;
        var maxZoom = 50;

        var projection = new ol.proj.Projection({
            code: 'ZOOMIFY',
            units: 'pixels',
            extent: [0, 0, mapEdge, mapEdge]
        });
        var projectionExtent = projection.getExtent();

        var maxResolution = ol.extent.getWidth(projectionExtent) / tileSize;
        var resolutions = [];
        for (var z = 1; z <= maxZoom; z++) {
            resolutions[z] = maxResolution / Math.pow(2, z);
        }

        var bigSpaceSource = new ol.source.TileImage({
            tileUrlFunction: function(tileCoord, pixelRatio, projection) {

                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = -tileCoord[2]-1;
                var uri = 'https://localhost:29002/openlayers/' + z + '/' + x + '/' + y + '.png';
                console.log( 'Requesting '+uri)
                return uri;
            },
            projection: projection,
            tileGrid: new ol.tilegrid.TileGrid({
                origin: ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                tileSize: tileSize
            }),
        });

        var view = new ol.View({
            projection: projection,
            //center: [mapEdge / 2, mapEdge / 2],
            center: [0.5,0.5],
            //   minZoom: 1,
            //  maxZoom: maxZoom,
            extent: projectionExtent
        });

        view.fit( [0,0,1,1]);


     /*   var svgExtent = [0, 0, 1, 1];
        var svgProjection = new ol.proj.Projection({
            code: 'static-image',
            units: 'pixels',
            extent: svgExtent
        });
        let vectorLayer =  new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: 'svg/smiley.svg',
                projection: svgProjection,
                imageExtent: svgExtent
            })
        })*/



        var layers = [
            new ol.layer.Tile({ source: bigSpaceSource, extent: projectionExtent})
          //  vectorLayer
            /*new ol.layer.Tile({
             source: new ol.source.TileDebug({
             projection: projection,
             tileGrid: bigSpaceSource.getTileGrid()
             })
             })*/
        ];

       /* var map = new ol.Map({
            target: 'map',
            loadTilesWhileAnimating: true,   // careful of performance on some devices
            loadTilesWhileInteracting: true, // careful of performance on some devices
            layers: layers,
            controls: ol.control.defaults().extend([
                new ol.control.FullScreen()
            ]),
            view: view
        });



        map.on('click', function(e) {
            console.log(e.coordinate);
        });*/

        /*var popup = new ol.Overlay({
            element: document.getElementById('smileyLayer'),
            autoPan: true
        });
        popup.setPosition([-1,1]);
        map.addOverlay(popup);*/
    }
}