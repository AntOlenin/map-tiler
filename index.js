'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

/**
 * Возвращает список тайлов, которые покрывают `boxes` на всех зумах до `maxZoom`
 *
 * @example
 *  var box = [[64.4727, -19.9511], [60.4727, -12.9511]] // [sw, ne]
 *  var boxes = [box]
 *  require('map-tiler')(boxes, 3) // -> ['0/0/0', '1/0/0', '2/0/1', ...]
 *
 * @param boxes
 * @param maxZoom
 * @returns {Array}
 */

exports['default'] = function (boxes, maxZoom) {
  if (!boxes) {
    throw new Error('param maxZoom is required');
  }
  if (!maxZoom) {
    throw new Error('param maxZoom is required');
  }
  var tiles = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = boxes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var box = _step.value;

      var _box = _slicedToArray(box, 2);

      var sw = _box[0];
      var ne = _box[1];

      var nw = [ne[0], sw[1]];
      var se = [sw[0], ne[1]];

      for (var zoom = 0; zoom <= maxZoom; zoom++) {
        var tCoordsNw = latLon2TCoords(nw, zoom);
        var tCoordsSe = latLon2TCoords(se, zoom);

        // координаты крайних точек бокса

        var _tCoordsNw = _slicedToArray(tCoordsNw, 2);

        var y1 = _tCoordsNw[0];
        var x1 = _tCoordsNw[1];

        var _tCoordsSe = _slicedToArray(tCoordsSe, 2);

        var y2 = _tCoordsSe[0];
        var x2 = _tCoordsSe[1];

        // зная координаты тайлов на Северо-Западном и Юго-Восточном углах
        // бокса, мы можем рассчитать координаты всех промежуточных тайлов
        // Отсчет тайлов идет от Северо-Западного угла
        for (var x = x1; x <= x2; x++) {
          for (var y = y1; y <= y2; y++) {
            tiles['' + zoom + '/' + x + '/' + y] = null;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return Object.keys(tiles);
};

/**
 * Конвертирует latLon координаты в координаты тайла tCoords.
 * @see http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames.
 */
function latLon2TCoords(latLon, zoom) {
  var _latLon = _slicedToArray(latLon, 2);

  var lat = _latLon[0];
  var lon = _latLon[1];

  var tLat = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  var tLon = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  return [tLat, tLon];
}
module.exports = exports['default'];
