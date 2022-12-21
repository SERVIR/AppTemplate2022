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
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

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
var baseMaps = {
    "OpenStreetMap": osm,
    "Satellite": satellite,

};
var datamaps = {
    "CHIRPS": wmsLayer,
    "ESI": ms
};
osm.addTo(map);
 L.control.layers(baseMaps).addTo(map);
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



$( "#settings" ).click(function() {
  $("#layer_manager").show();
});

$( "#save_settings" ).click(function() {
       var chirps = L.tileLayer.wms('https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4', {
        layers: 'precipitation_amount',
        transparency: 'true',
        format: 'image/png',
         style: 'boxfill/apcp_surface',
        maxZoom: 21,
        opacity: $("#opacity_chirps").val()
    });


  var testTimeLayer = L.timeDimension.layer.wms(chirps, {
            updateTimeDimension: true
        });
     if ($("#chirps").is(':checked')){

         chirps.addTo(map);

       // testTimeLayer.addTo(map);
 }
     else{
         map.remove(chirps);
     }
 if($("#esi").is(':checked')) {
     let esi = L.esri.dynamicMapLayer({
        url: 'https://gis1.servirglobal.net/arcgis/rest/services/Global/ESI_4WK/MapServer',
         transparency: 'true',
        format: 'image/png',
         style: 'boxfill/apcp_surface',
        maxZoom: 21,
        opacity: $("#opacity_esi").val()
    });


        esi.addTo(map);

 }


});
