var tiler = require('./../index');

for (var n of [102, 291]) {
  var boxes = require('./'+n+'.json');
  console.time('getTiles'+n);
  tiler(boxes, 19);
  console.timeEnd('getTiles'+n);
}





