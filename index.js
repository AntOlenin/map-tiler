var _ = require('underscore');


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

function MapTiler() {

}

MapTiler.prototype.defaultMaxZoom = 14;

MapTiler.prototype.getTiles = function(boxes, zoom) {
    var maxZoom = zoom || this.defaultMaxZoom;
    return this.getPairDictByBoxList(boxes, maxZoom);
};

MapTiler.prototype.getPairDictByBoxList = function(boxes, maxZoom) {
    var pairDict = {};
    boxes.forEach(function(box) {
         MapTiler.prototype.extendPairDictByOneBox(pairDict, box, maxZoom)
    });
    return pairDict;
};

MapTiler.prototype.extendPairDictByOneBox = function(pairDict, box, maxZoom) {
    for (var zoom=0; zoom<=maxZoom; zoom++) {
        var oneZoomPairList = this.getOneZoomPairList(box, zoom);
        pairDict[zoom] = _.union((pairDict[zoom] || []), oneZoomPairList);
    }
};

/**
 * Получаем список координат тайлов для одного значения zoom.
 * */
MapTiler.prototype.getOneZoomPairList = function(box, zoom) {
    var nw = [box[1][0], box[0][1]];
    var se = [box[0][0], box[1][1]];
    var tCoordsNw = this.latLon2TCoords(nw, zoom);
    var tCoordsSe = this.latLon2TCoords(se, zoom);
    return this.getFullPairList(tCoordsNw, tCoordsSe);
};

/**
 * Конвертирует latLon координаты в координаты тайла tCoords.
 * Формулы: http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames.
 * */
MapTiler.prototype.latLon2TCoords = function(latLon, zoom) {
    var lat = latLon[0];
    var lon = latLon[1];
    var tLat = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
    var tLon = Math.floor((lon+180)/360*Math.pow(2,zoom));
    return [tLat, tLon];
};

/**
 * Зная координаты тайлов на Северо-Западном и Юго-Восточном углах
 * бокса, мы можем рассчитать координаты всех промежуточных тайлов.
 * Отсчет тайлов идет от Северо-Западного угла.
 * */
MapTiler.prototype.getFullPairList = function(tCoordsNw, tCoordsSe) {
    var yRange = _.range(tCoordsNw[0], tCoordsSe[0]+1);
    var xRange = _.range(tCoordsNw[1], tCoordsSe[1]+1);

    var pairList = [];
    for (var x=0; x<xRange.length; x++) {
        for (var y=0; y<yRange.length; y++) {
            pairList.push(xRange[x] + '/' + yRange[y])
        }
    }

    return pairList;
};


module.exports = MapTiler;