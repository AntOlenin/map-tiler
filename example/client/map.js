(function () {

var gMaps = google.maps,
    gPolyline = gMaps.Polyline,
    gEvent = gMaps.event,
    addListenerOnce = gEvent.addListenerOnce,
    gLatLng = gMaps.LatLng,
    gBounds = gMaps.LatLngBounds,
    gRectangle = gMaps.Rectangle,

    $newBtn = $('#new'),
    $helpBar = $('#helpbar'),
    $calcBtn = $('#calculate'),

    mapOptions = {
        center: new gMaps.LatLng(50, 12),
        zoom: 6,
        mapTypeId: gMaps.MapTypeId.ROADMAP
    },

    map = new gMaps.Map(document.getElementById("map_canvas"), mapOptions),
    polyline = new gPolyline({map: map}),
    polylineOptions = {first: null, last: null, path: null};

    $newBtn.on('click', drawOn);


function drawOn() {
    if (polyline) {
        polyline.setPath([]);
        $calcBtn.hide();
    }

    addListenerOnce(map, 'click', firstClickHandle);
    map.setOptions({draggableCursor: 'crosshair'});
    $helpBar.text('Кликни по карте, чтобы поставить первую точку');
}

function firstClickHandle(position) {
    polylineOptions.first = position.latLng;
    addListenerOnce(map, 'click', lastClickHandle);
    $helpBar.text('Поставь вторую точку, чтобы маршрут создался');
}

function lastClickHandle(position) {
    polylineOptions.last = position.latLng;
    buildDirections();
    map.setOptions({draggableCursor: 'default'});
    $helpBar.text('Нажми new, чтобы начать заново');
}

function buildDirections() {
    var directionsService = new gMaps.DirectionsService(),
        request = {
            origin: polylineOptions.first,
            destination: polylineOptions.last,
            travelMode: gMaps.TravelMode.DRIVING
        };

    directionsService.route(request, buildDirectionsCallback);
}

function buildDirectionsCallback(response, status) {
    if (status == gMaps.DirectionsStatus.OK) {
        polylineOptions.path = response.routes[0].overview_path;
        polyline.setPath(polylineOptions.path);
        $calcBtn.show();
        $calcBtn.on('click', buildBoxes);
    }
}

function buildBoxes() {
    var serverPath = convertToServerPath(polylineOptions.path),
        data = {path: JSON.stringify(serverPath)};
    $.get('/map-tiler', data).done(function (resp) {
        debugger
    });
}

function convertToServerPath(path) {
    var newPath = [];
    path.forEach(function(latLng) {
        var one = [latLng.lat(), latLng.lng()];
        newPath.push(one);
    });
    return newPath;
}


}());