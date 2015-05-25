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

var sw = [lat, lon] // south west corner
var ne = [lat, lon] // northeast corner
var box = [sw, ne]; // bounds for getting tiles

var boxes = [box];
var maxZoom = 3;

var tiles = mapTiler(boxes, maxZoom);
```

Result
-----
```js
[
    "0/0/0",
    "1/0/0"
    "2/0/1"
    "3/1/2",
    "3/1/3"
  ]
}
```

Advanced
-------

You can get boxes of path by npm [anyboxer](https://www.npmjs.com/package/anyboxer).

Where path has [ [lat, lon], [lat, lon], [lat, lon] ] format.


License
-------
MIT

    
