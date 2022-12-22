const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')

const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
var map = L.map('map', {
    fullscreenControl: true,
    timeDimension: true,
    timeDimensionOptions: {
        timeInterval: "2015-09-01/2015-09-03",
        period: "PT1H",
        currentTime: Date.parse("2015-09-01T00:00:00Z")
    },
    timeDimensionControl: true,
    timeDimensionControlOptions: {
        autoPlay: false,
        loopButton: true,
        timeSteps: 1,
        playReverseButton: true,
        limitSliders: true,
        playerOptions: {
            buffer: 0,
            transitionTime: 250,
            loop: true,
        }
    }, center: [42.35, -71.08], zoom: 3
});

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

// create a satellite imagery layer
let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
var wmsLayer = L.tileLayer.wms('https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4', {
    layers: 'precipitation_amount',
    format: 'image/png',
    transparent: true,
    style: 'boxfill/apcp_surface',
    zIndex: 200
});
let ms = L.esri.dynamicMapLayer({
    url: 'https://gis1.servirglobal.net/arcgis/rest/services/Global/ESI_4WK/MapServer',
});

var datamaps = {
    "CHIRPS": wmsLayer,
    "ESI": ms
};
osm.addTo(map);
// L.control.layers(baseMaps).addTo(map);
// L.control
//     .opacity(datamaps, {
//         label: 'Layers Opacity',
//     })
//     .addTo(map);


//   var wmsLayer = L.tileLayer.wms('https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4', {
//             layers: 'precipitation_amount',
//             format: 'image/png',
//             transparent: true,
//             style: 'boxfill/apcp_surface',
//       zIndex:200
//         });
// wmsLayer.addTo(map);
// spinner.stop();

// var geocoder = L.Control.geocoder({
//   defaultMarkGeocode: false
// })
//   .on('markgeocode', function(e) {
//     var bbox = e.geocode.bbox;
//     var poly = L.polygon([
//       bbox.getSouthEast(),
//       bbox.getNorthEast(),
//       bbox.getNorthWest(),
//       bbox.getSouthWest()
//     ]).addTo(map);
//     map.fitBounds(poly.getBounds());
//   })


L.Control.geocoder().addTo(map);


var chirps = L.tileLayer.wms('https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4', {
    layers: 'precipitation_amount',
    transparency: 'true',
    format: 'image/png',
    style: 'boxfill/apcp_surface',
    maxZoom: 21,
    zIndex: 400,
    opacity: $("#opacity_chirps").val()
});
let esi = L.esri.dynamicMapLayer({
    url: 'https://gis1.servirglobal.net/arcgis/rest/services/Global/ESI_4WK/MapServer',
    transparency: 'true',
    format: 'image/png',
    style: 'boxfill/apcp_surface',
    maxZoom: 21,
    opacity: $("#opacity_esi").val()
});

var testTimeLayer = L.timeDimension.layer.wms(chirps, {
    updateTimeDimension: true
});
$("#chirps").change(function() {
    if (this.checked) {
        // chirps.addTo(map);

        testTimeLayer.addTo(map);
    }
    else{
        testTimeLayer.remove();
    }
});

$("#esi").change(function() {
    if (this.checked) {


        esi.addTo(map);

    }
    else{
        esi.remove();
    }
});

$('#opacity_chirps').change(function() {
                testTimeLayer.setOpacity($(this).val());
            });

$('#opacity_esi').change(function() {
                esi.setOpacity($(this).val());
            });

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


var baseMaps = {
    "OpenStreetMap": osm,
    "Satellite": satellite,
    "OpenTopoMap": OpenTopoMap

};

var control = L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);
var a = document.getElementById('basemaps');

var htmlObject = control.getContainer();

// Finally append that node to the new parent, recursively searching out and re-parenting nodes.
function setParent(el, newParent) {
    newParent.appendChild(el);
}

setParent(htmlObject, a);
