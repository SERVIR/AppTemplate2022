 $('#opacity_chirps').hide();
 $('#opacity_esi').hide();
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


var chirps = L.tileLayer.wms('https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4', {
    layers: 'precipitation_amount',
    transparent: 'true',
    format: 'image/png',
    style: 'boxfill/apcp_surface',
    maxZoom: 21,
    zIndex: 400,
    opacity: $("#opacity_chirps").val()
});
let esi = L.esri.dynamicMapLayer({
    url: 'https://gis1.servirglobal.net/arcgis/rest/services/Global/ESI_4WK/MapServer',
    transparent: 'true',
    format: 'image/png',
    style: 'boxfill/apcp_surface',
    maxZoom: 21,
    opacity: $("#opacity_esi").val()
});

var testTimeLayer = L.timeDimension.layer.wms(chirps, {
    updateTimeDimension: true
});
$("#chirps").change(function () {
    if (this.checked) {
        // chirps.addTo(map);

        testTimeLayer.addTo(map);
        testTimeLayer.bringToFront();
         var val=Math.round($('#opacity_chirps').val()*100);
                $('#chirps_opacity').text(val+"%");
                  $('#chirps_opacity').show();
                                              $('#opacity_chirps').show();

    } else {
        testTimeLayer.remove();
        $('#chirps_opacity').hide();
                                                      $('#opacity_chirps').hide();

    }
});

$("#esi").change(function () {
    if (this.checked) {
        esi.addTo(map);
        esi.bringToFront();
        var val = Math.round($('#opacity_esi').val() * 100);
        $('#esi_opacity').text(val + "%");
        $('#esi_opacity').show();
        $('#opacity_esi').show();


    } else {
        esi.remove();
        $('#esi_opacity').hide();
        $('#opacity_esi').hide();
    }
});

$('#opacity_chirps').change(function () {
    testTimeLayer.setOpacity($(this).val());
     var val=Math.round($(this).val()*100);
                  $('#chirps_opacity').text(val+"%");
});

$('#opacity_esi').change(function () {
    esi.setOpacity($(this).val());
     var val=Math.round($(this).val()*100);
                  $('#esi_opacity').text(val+"%");
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
//
// var control = L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);
// var a = document.getElementById('basemaps');
//
// var htmlObject = control.getContainer();

// Finally append that node to the new parent, recursively searching out and re-parenting nodes.
function setParent(el, newParent) {
    newParent.appendChild(el);
}

// setParent(htmlObject, a);

var control1 = L.Control.geocoder({collapsed: false});

control1.addTo(map);


let layerControlDiv = control1.getContainer();

// you can set an id for it if you want to use it to override the CSS later
layerControlDiv.setAttribute("id", "layer-control-id");

let layerControlParentLayer = L.control({
    position: "topright"
});
layerControlParentLayer.onAdd = function (map) {
    // Create the main div that will hold all your elements
    let parentDiv = L.DomUtil.create("a");

    // you can set an id for it if you want to use it for CSS
    parentDiv.setAttribute("id", "layer-control-parent-id");
    parentDiv.appendChild(layerControlDiv);
    L.DomEvent.disableClickPropagation(parentDiv);
    return parentDiv;
};
// add the Layer to the map
layerControlParentLayer.addTo(map);
var htmlObject = layerControlParentLayer.getContainer();
var a = document.getElementById('location');
setParent(htmlObject, a);
var terrainLayer = L.tileLayer(
    "https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}",
    {
        attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'rU9sOZqw2vhWdd1iYYIFqXxstyXPNKIp9UKC1s8NQkl9epmf0YpFF8a2HX1sNMBM',
        opacity: 1,
        thumb: "img/terrain.png",
        displayName: "Terrain",
    }
);
var deLormeLayer = L.tileLayer.wms(
    "https://server.arcgisonline.com/arcgis/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",
    {
        format: "image/png",
        transparent: true,
        attribution:
            'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/Reference/Specialty/DeLorme_World_Base_Map/MapServer">ArcGIS</a>',
        opacity: 1,
        thumb: "img/delorme.png",
        displayName: "DeLorme",
    }
);
var gSatLayer = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    {
        format: "image/png",
        transparent: true,
        attribution:
            'Tiles © Map data ©2019 Google',
        opacity: 1,
        thumb: "img/gsatellite.png",
        displayName: "Google Satellite",
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }
);

removeLayers = function () {
    satellite.remove();
    osm.remove();
    OpenTopoMap.remove();
    terrainLayer.remove();
    deLormeLayer.remove();
    gSatLayer.remove();
}

add_basemap = function (map_name) {
    removeLayers();

    switch (map_name) {
        case "osm":

            osm.addTo(map);
            // osm.bringToFront();

            break;
        case "delorme":
            deLormeLayer.addTo(map);
            break;
        case "satellite":
            satellite.addTo(map);
            break;

        case "terrain":
            terrainLayer.addTo(map);
            break;
        case "topo":
            OpenTopoMap.addTo(map);
            break;
        case "gsatellite":
            gSatLayer.addTo(map);
            break;
        default:
            osm.addTo(map);

    }
}

 var legend = L.control({
            position: 'bottomleft'
        });

            link = chirps + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=precipitation_amount&colorscalerange&PALETTE=boxfill/adpc&transparent=TRUE";
            imgsrc = link;
            console.log(imgsrc)
            legend.onAdd = function (map) {
            var src = imgsrc;
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML +=
                '<img src="' + src + '" alt="legend">';
            return div;
        };
        legend.addTo(map);