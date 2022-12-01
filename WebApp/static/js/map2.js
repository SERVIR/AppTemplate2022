
var map = L.map('map2',{center: [42.35, -71.08], zoom: 3});

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
var gee_layer ,user_layer;
var  datamaps = {
    "ImageCollection":gee_layer,
    "UserAsset":user_layer
};
ajax_call("get-gee-layer", {}).done(function (data) {
    console.log(data['url']);
    gee_layer = L.tileLayer(data['url'], {
    zoom:3});
    gee_layer.addTo(map);
  //  layerControl.addOverlay(gee_layer, "gee");
    datamaps.ImageCollection=gee_layer;
    update_map();
});
ajax_call("get-gee-user-layer", {}).done(function (data) {
    console.log(data['url']);
    user_layer = L.tileLayer(data['url'], {
    zoom:3});
 //   layerControl.addOverlay(user_layer, "user");
    datamaps.UserAsset=user_layer;
    update_map();
});

function update_map(){
    var layerControl = L.control.layers(baseMaps,datamaps).addTo(map);
L.control
    .opacity(datamaps, {
        label: 'Layers Opacity',
    })
    .addTo(map);
L.Control.geocoder().addTo(map);
}




