
var map = L.map('map2').setView([71.72, 52.48], 3);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
let streets = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' ).addTo( map)

// create a satellite imagery layer
let satellite = L.tileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' )
var baseMaps = {

    "OpenStreetMap": osm,
  "Satellite": satellite
};
var layerControl = L.control.layers(baseMaps).addTo(map);
var gee_layer = L.tileLayer('');
ajax_call("get-gee-layer", {}).done(function (data) {
    console.log(data['url']);
    var gee_layer = L.tileLayer(data['url'], {
    zoom:3});
    gee_layer.addTo(map);
});

L.Control.geocoder().addTo(map);
