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
    var lineString = JSON.parse(req.query.path);

    var options = {
        data: {
            lineString: lineString
        },
        fat: 30,
        split: true
    };
    var boxes = boxer.getBoxes(options);
    var tiles = tiler.getTiles(boxes);
    return res.send(tiles);
});

var server = app.listen(3000, function() {
    var address = server.address();
    console.log('Example app listening at http://%s:%s', address.address, address.port)
});
