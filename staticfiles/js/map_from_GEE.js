const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
var map = L.map('map2', {center: [42.35, -71.08], zoom: 3});

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

// create a satellite imagery layer
let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var baseMaps = {

    "OpenStreetMap": osm,
    "Satellite": satellite
};
var gee_layer, user_layer;
var datamaps = {
    "ImageCollection": gee_layer,
    "UserAsset": user_layer
};
 ajax_call("get-gee-user-layer", {}).done(function (data) {
     console.log(data['url']);
     user_layer = L.tileLayer(data['url'], {
         zoom: 3,
         zIndex:400
     });
 });
ajax_call("get-gee-layer", {}).done(function (data) {
     gee_layer = L.tileLayer(data['url'], {
         zoom: 3,
         zIndex: 400
     });
 });
update_map();
$("#collection").change(function() {
    if (this.checked) {
        gee_layer.addTo(map);
    } else {
        gee_layer.remove();
    }
});

$("#asset").change(function() {
    if (this.checked) {
       user_layer.addTo(map);
    }
    else{
        user_layer.remove();
    }
});

$('#opacity_collection').change(function() {
                gee_layer.setOpacity($(this).val());
            });
$('#opacity_asset').change(function() {
                user_layer.setOpacity($(this).val());
            });

function update_map() {
    osm.addTo(map);

  //  var layerControl = L.control.layers(baseMaps, datamaps).addTo(map);
        var layerControl = L.control.layers(baseMaps).addTo(map);

    // L.control
    //     .opacity(datamaps, {
    //         label: 'Layers Opacity',
    //     })
    //     .addTo(map);
    L.Control.geocoder().addTo(map);
}


var baseMaps = {
    "OpenStreetMap": osm,
    "Satellite": satellite,

};

var control = L.control.layers(baseMaps, null, {collapsed: false});
var a = document.getElementById('basemaps_gee');

var htmlObject = control.getContainer();

// Finally append that node to the new parent, recursively searching out and re-parenting nodes.
function setParent(el, newParent) {
    newParent.appendChild(el);
}

setParent(htmlObject, a);


