var express = require('express');
var app = express();

app.use("/js", express.static(__dirname + '/client'));
app.set('views', __dirname + '/views');

var anyBoxer = require('anyboxer');
var boxer = new anyBoxer;

var mapTiler = require('../index');
var tiler = new mapTiler;

app.get('/', function (req, res) {
    res.render('index.jade', {name: 'mi'});
});

app.get('/map-tiler', function(req, res) {
    var path = JSON.parse(req.query.path);

    var data = { "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": path
                },
                "properties": {
                    "fat": 5
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "MultiLineString",
                    "coordinates": [
                        [ [0,0], [1,1] ],
                        [ [0,0], [-1, -1] ]
                    ]
                },
                "properties": {
                    "fat": 5
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [5,5]
                },
                "properties": {
                    "fat": 20
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "MultiPoint",
                    "coordinates": [
                        [10,10], [20, 20], [30, 30]
                    ]
                },
                "properties": {
                    "fat": 40
                }
            },
        ]
    };
    var boxes = boxer.getBoxes(data); // вторым параметром можно будет передать split(boolean)
    var tiles = tiler.getTiles(boxes);
    return res.send({boxes: boxes, tiles: tiles});
});

var server = app.listen(3000, function() {
    var address = server.address();
    console.log('Example app listening at http://%s:%s', address.address, address.port)
});
