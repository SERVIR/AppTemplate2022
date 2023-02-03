$(function () {
// Initialize with map control with basemap and time slider
    var map = L.map('map_aoi', {
        zoomControl: true
        , center: [42.35, -71.08], zoom: 3
    });
    map.zoomControl.setPosition('topright');
    osm.addTo(map);
// Initialise the FeatureGroup to store editable layers


    var drawnItems = new L.FeatureGroup();

    map.addLayer(drawnItems);

    var drawControlFull = new L.Control.Draw({
        position: 'topright',
        draw: {
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#97009c'
                }
            },
            // disable toolbar item by setting it to false
            polyline: false,
            circle: false, // Turns off this drawing tool
            rectangle: false,
            marker: false,
            circlemarker: false
        },

        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });

    map.addControl(drawControlFull);

    map.on("draw:created", function (e) {
        document.getElementById("export").style.display = "initial";
        //var drawn_layer = e.layer;
        var temp = drawnItems.addLayer(e.layer);
        document.getElementById('export').onclick = function (e) {
            // Extract GeoJson from featureGroup
            var data = drawnItems.toGeoJSON();
            // Stringify the GeoJson
            var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
            // Create export
            document.getElementById('export').setAttribute('href', 'data:' + convertedData);
            document.getElementById('export').setAttribute('download', 'drawn_aoi.geojson');
        };

    });
});