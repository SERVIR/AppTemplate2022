
var map = L.map('map3').setView([71.72, 52.48], 3);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
let streets = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' ).addTo( map)

// create a satellite imagery layer
let satellite = L.tileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' )
var baseMaps = {

    "OpenStreetMap": streets,
  "Satellite": satellite
};
var layerControl = L.control.layers(baseMaps).addTo(map);


L.Control.geocoder().addTo(map);
