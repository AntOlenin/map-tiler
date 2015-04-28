var express = require('express');
var app = express();

app.use("/js", express.static(__dirname + '/client'));
app.set('views', __dirname + '/views');

var anyBoxer = require('anyboxer');
var mapTiler = require('../index');

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
                    "fat": 0.2
                }
            }
        ]
    };

    var options = {
        split: false,
        reverse: true
    };

    anyBoxer(data, options, function(err, boxes) {
        var tiles = mapTiler(boxes, 19);
        res.send({boxes: boxes, tiles: tiles});
    });

});

var server = app.listen(3000, function() {
    console.log('Example app listening at http://localhost:3000')
});
