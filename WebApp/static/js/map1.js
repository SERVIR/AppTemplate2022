
 var map = L.map('map').setView([42.35, -71.08], 3);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
let streets = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' ).addTo( map )

// create a satellite imagery layer
let satellite = L.tileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' )
   var wmsLayer = L.tileLayer.wms('https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4', {
            layers: 'precipitation_amount',
            format: 'image/png',
            transparent: true,
            style: 'boxfill/apcp_surface',
      zIndex:200
        });
 let ms=L.esri.dynamicMapLayer({
    url: 'https://gis1.servirglobal.net/arcgis/rest/services/Global/ESI_4WK/MapServer',
  });
var baseMaps = {
    "OpenStreetMap": osm,
  "Satellite": satellite,

};
var datamaps = {
    "CHIRPS":wmsLayer,
    "ESI":ms
};

 L.control.layers(baseMaps,datamaps).addTo(map);
L.control
    .opacity(datamaps, {
        label: 'Layers Opacity',
    })
    .addTo(map);
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
//   .addTo(map);

L.Control.geocoder().addTo(map);
