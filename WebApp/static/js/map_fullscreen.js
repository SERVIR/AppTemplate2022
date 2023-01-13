$('#opacity_esi_full').hide();
$('#opacity_chirps_full').hide();

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')

const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
var map = L.map('map3', {
    zoomControl: false,
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


L.control.zoom({
    position: 'topright'
}).addTo(map);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

// create a satellite imagery layer
let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

var baseMaps = {
    "OpenStreetMap": streets,
    "Satellite": satellite
};
osm.addTo(map);
// L.Control.geocoder().addTo(map);


var chirps = L.tileLayer.wms('https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4', {
    layers: 'precipitation_amount',
    transparent: 'true',
    format: 'image/png',
    style: 'boxfill/apcp_surface',
    maxZoom: 21,
    zIndex: 400,
    opacity: 0.5
});
let esi = L.esri.dynamicMapLayer({
    url: 'https://gis1.servirglobal.net/arcgis/rest/services/Global/ESI_4WK/MapServer',
    transparent: 'true',
    format: 'image/png',
    style: 'boxfill/apcp_surface',
    maxZoom: 21,
    opacity: 0.5
});

var testTimeLayer = L.timeDimension.layer.wms(chirps, {
    updateTimeDimension: true
});
var chirps_wms = 'https://thredds.servirglobal.net/thredds/wms/Agg/ucsb-chirps_global_0.05deg_daily.nc4';
var esi_wms = 'https://gis1.servirglobal.net/arcgis/rest/services/Global/ESI_4WK/MapServer';
var chirps_variable = 'precipitation_amount';
var style = 'boxfill/apcp_surface';
var colorscalerange = '0,5';
$("#chirps_full").change(function () {
    if (this.checked) {
        testTimeLayer.addTo(map);
        testTimeLayer.bringToFront();
        var val = Math.round($('#opacity_chirps_full').val() * 100);
        $('#chirps_full_opacity').text(val + "%");
        $('#chirps_full_opacity').show();
        $('#opacity_chirps_full').show();
                add_legend_fixed_size("chirps", chirps_wms, chirps_variable, colorscalerange, style, 'legend_full_chirps');


    } else {
        testTimeLayer.remove();
        $('#chirps_full_opacity').hide();
        $('#opacity_chirps_full').hide();
                remove_legend_fixed_size("chirps");

    }
});

$("#esi_full").change(function () {
    if (this.checked) {
        esi.addTo(map);
        esi.bringToFront();
        var val = Math.round($('#opacity_esi_full').val() * 100);
        $('#esi_full_opacity').text(val + "%");
        $('#esi_full_opacity').show();
        $('#opacity_esi_full').show();
                        add_legend_fixed_size("esi", esi_wms, "", colorscalerange, style, 'legend_full_esi');

    } else {
        esi.remove();
        $('#esi_full_opacity').hide();
        $('#opacity_esi_full').hide();
                remove_legend_fixed_size("esi");

    }
});

$('#opacity_chirps_full').change(function () {
    testTimeLayer.setOpacity($(this).val());
    var val = Math.round($(this).val() * 100);
    $('#chirps_full_opacity').text(val + "%");
});

$('#opacity_esi_full').change(function () {
    esi.setOpacity($(this).val());
    var val = Math.round($(this).val() * 100);
    $('#esi_full_opacity').text(val + "%");
});

// Finally append that node to the new parent, recursively searching out and re-parenting nodes.
function setParent(el, newParent) {
    newParent.appendChild(el);
}

// setParent(htmlObject, a);

var control1 = L.Control.geocoder({collapsed: false});

control1.addTo(map);


let layerControlDiv = control1.getContainer();

// you can set an id for it if you want to use it to override the CSS later
layerControlDiv.setAttribute("id", "layer-control-id-full");

let layerControlParentLayer = L.control({
    position: "topright"
});
layerControlParentLayer.onAdd = function (map) {
    // Create the main div that will hold all your elements
    let parentDiv = L.DomUtil.create("a");

    // you can set an id for it if you want to use it for CSS
    parentDiv.setAttribute("id", "layer-control-parent-id-full");
    parentDiv.appendChild(layerControlDiv);
    L.DomEvent.disableClickPropagation(parentDiv);
    return parentDiv;
};
// add the Layer to the map
layerControlParentLayer.addTo(map);
var htmlObject = layerControlParentLayer.getContainer();
var a = document.getElementById('location_full');
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

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


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
};

function add_legend_fixed_size(dataset, wms, variable, colorscalerange, palette, element) {
    if (variable === "") {
        var base_service_url = wms;

        $.ajax({
            url: base_service_url + "/legend?f=json",
            type: "GET",
            async: true,
            crossDomain: true
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.warn(jqXHR + textStatus + errorThrown);
        }).done(function (data, _textStatus, _jqXHR) {
            if (data.errMsg) {
                console.info(data.errMsg);
            } else {
                add_other_legend(data, dataset, wms);
            }
        });
    } else {
        var legend = L.control({});
        var link = wms + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=" + variable + "&colorscalerange=" + colorscalerange + "&PALETTE=" + palette + "&transparent=TRUE";
        legend.onAdd = function (map) {
            var src = link;
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML +=
                '<img src="' + src + '" alt="legend">';
            div.id = "legend_" + dataset;
            div.className = "thredds-legend";
            return div;
        };
        legend.addTo(map);
        var htmlObject = legend.getContainer();
        var a = document.getElementById(element);
        setParent(htmlObject, a);
    }
}

function remove_legend_fixed_size(val) {
    document.getElementById("legend_" + val).remove();
}

function add_other_legend(response, dataset, base_service_url) {
    var htmlString = "<table>";
    for (var iCnt = 0; iCnt < response.layers.length; iCnt++) {
        lyr = response.layers[iCnt];
        if (lyr.layerId == 3) {
            if (lyr.legend.length > 1) {
                htmlString += "<tr><td colspan='2' style='font-weight:bold;'>" + dataset + "</td></tr>";
                for (var jCnt = 0; jCnt < lyr.legend.length; jCnt++) {
                    var src = base_service_url + "/" + lyr.layerId + "/images/" + lyr.legend[jCnt].url;
                    var strlbl = lyr.legend[jCnt].label.replace("<Null>", "Null");
                    htmlString += "<tr><td align='left'><img src=\"" + src + "\" alt ='' /></td><td>" + strlbl + "</td></tr>";
                }
            } else {
                htmlString += "<tr><td colspan='2' class='tdLayerHeader' style='font-weight:bold;'>" + dataset + "</td></tr>";
                var img_src = base_service_url + "/" + lyr.layerId + "/images/" + lyr.legend[0].url;
                htmlString += "<tr><td colspan='2' ><img src=\"" + img_src + "\" alt ='' /></td></tr>";
            }
        }
    }
    htmlString += "</table>";
    var div = document.createElement('div');
    div.innerHTML += htmlString;

    div.id = "legend_" + dataset;
    div.className = "arcgis-legend";
    document.getElementById("legend_full_"+dataset).appendChild(div);

}
