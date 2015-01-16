# map-tiler


Installation
------------
```sh
npm install map-tiler --save
```

Usage
-----

```js
var mapTiler = require('map-tiler');
var tiler = new mapTiler;

var sw = [lat, lon] // south west corner
var ne = [lat, lon] // northeast corner
var box = [sw, ne]; // bounds for getting tiles

var boxes = [box];
var maxZoom = 3;

var tiles = tiler.getTiles(boxes, maxZoom);
```

Result
-----
```js
{
  0: [
    "0/0"
  ],
  1: [
    "0/0"
  ],
  2: [
    "0/1"
  ],
  3: [
    "1/2",
    "1/3"
  ]
}
```


License
-------
MIT

    
