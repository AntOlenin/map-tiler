var _ = require('underscore'),
    async = require('async'),
    MAX_ZOOM_DEFAULT = 14,
    pairDict = {};


/**
 *
 * pair        1/1
 * pairList   [pair, pair, pair, pair]
 * pairDict   {1: pair_list, 2: pair_list, 3: pair_list}
 *
 * boxList    [box, box, box, box, box]
 * box         [[64.4727, -19.9511], [60.4727, -12.9511]] - [sw, ne]
 *
 * latLon      [64.4727, -19.9511] - числа подобны значениям lat и lng у google
 * tCoords     [1, 2]              - столбец и строка тайла. Отсчет с нулевого тайла
 *
 * */

function mapTiler(boxes, zoom) {
    pairDict = {};
    var maxZoom = zoom || MAX_ZOOM_DEFAULT;
    createPairDictByBoxList(boxes, maxZoom);

    _.each(Object.keys(pairDict), function (key) {
        pairDict[key].sort();
        pairDict[key] = _.uniq(pairDict[key], true);
    });

    return pairDict;
}

function mapTilerAsync(boxes, zoom, callback) {
    pairDict = {};
    var maxZoom = zoom || MAX_ZOOM_DEFAULT;
    createPairDictByBoxList(boxes, maxZoom);

    asyncUniqDict(pairDict, function (err, result) {
        callback(null, result);
    });
}

function createPairDictByBoxList(boxes, maxZoom) {
    boxes.forEach(function(box) {
         extendPairDictByOneBox(box, maxZoom)
    });
}

function extendPairDictByOneBox(box, maxZoom) {
    for (var zoom=0; zoom<=maxZoom; zoom++) {
        extendOneZoomPairList(box, zoom);
    }
}

/**
 * Получаем список координат тайлов для одного значения zoom.
 * */
function extendOneZoomPairList(box, zoom) {
    var nw = [box[1][0], box[0][1]],
        se = [box[0][0], box[1][1]],
        tCoordsNw = latLon2TCoords(nw, zoom),
        tCoordsSe = latLon2TCoords(se, zoom);
        extendByFullPairList(tCoordsNw, tCoordsSe, zoom);
}

/**
 * Конвертирует latLon координаты в координаты тайла tCoords.
 * Формулы: http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames.
 * */
function latLon2TCoords(latLon, zoom) {
    var lat = latLon[0], lon = latLon[1], tLat, tLon;
    tLat = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
    tLon = Math.floor((lon+180)/360*Math.pow(2,zoom));
    return [tLat, tLon];
}

/**
 * Зная координаты тайлов на Северо-Западном и Юго-Восточном углах
 * бокса, мы можем рассчитать координаты всех промежуточных тайлов.
 * Отсчет тайлов идет от Северо-Западного угла.
 * */
function extendByFullPairList(tCoordsNw, tCoordsSe, zoom) {
    var yRange = _.range(tCoordsNw[0], tCoordsSe[0]+1),
        xRange = _.range(tCoordsNw[1], tCoordsSe[1]+1);

    for (var x=0; x<xRange.length; x++) {
        for (var y=0; y<yRange.length; y++) {
            var pair = xRange[x] + '/' + yRange[y];

            if (!pairDict[zoom]) pairDict[zoom] = [];
            pairDict[zoom].push(pair)
        }
    }
}


function asyncUniqDict(dict, callback) {
    var newDict = {},
        keys = Object.keys(pairDict);

    async.eachSeries(keys,

        function (key, callback) {
            setTimeout(function() {
                asyncUniq(dict[key], function (err, result) {
                    newDict[key] = result;
                    callback();
                });
            }, 1);
        },

        function (err) {
            if (err) throw err;
            callback(null, newDict);
        }

    )
}

function asyncUniq(array, callback) {
    var result = [];

    async.eachSeries(array,

        function (item, callback) {
            setTimeout(function() {
                if (!_.contains(result, item)) {
                    result.push(item);
                }
                callback();
            }, 1);
        },

        function (err) {
            if (err) throw err;
            callback(null, result);
        }
    );
}


module.exports = {
    sync: mapTiler,
    async: mapTilerAsync
};