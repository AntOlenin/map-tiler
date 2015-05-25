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
export default (boxes, maxZoom)=> {
  if (!boxes) {throw new Error('param maxZoom is required')}
  if (!maxZoom) {throw new Error('param maxZoom is required')}
  var tiles = {};

  for (var box of boxes) {
    let [sw, ne] = box;
    let nw = [ne[0], sw[1]];
    let se = [sw[0], ne[1]];

    for (var zoom=0; zoom<=maxZoom; zoom++) {
      let tCoordsNw = latLon2TCoords(nw, zoom);
      let tCoordsSe = latLon2TCoords(se, zoom);

      // координаты крайних точек бокса
      let [y1, x1] = tCoordsNw;
      let [y2, x2] = tCoordsSe;

      // зная координаты тайлов на Северо-Западном и Юго-Восточном углах
      // бокса, мы можем рассчитать координаты всех промежуточных тайлов
      // Отсчет тайлов идет от Северо-Западного угла
      for (var x=x1; x<=x2; x++) {
        for (var y=y1; y<=y2; y++) {
          tiles[`${zoom}/${x}/${y}`] = null;
        }
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
  var [lat, lon] = latLon;
  var tLat = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
  var tLon = Math.floor((lon+180)/360*Math.pow(2, zoom));
  return [tLat, tLon];
}