$('#opacity_chirps').hide();
$('#opacity_esi').hide();
$('#loading_fixed').hide();
// Helpers to show/hide the popovers when the info button is clicked
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
[...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

// Initialize with map control with basemap and time slider
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

osm.addTo(map);

// Variables for the WMS layers
var chirps_variable = 'precipitation_amount';
var style = 'boxfill/apcp_surface';
var colorscalerange = '0,5';

// Initialize the WMS layers
var chirpsTimeLayer = L.timeDimension.layer.wms(chirps, {
    updateTimeDimension: true
});
chirpsTimeLayer.on('timeload', function (event) {
    $('#loading_fixed').hide();
});

esi.on('load', function (event) {
    $('#loading_fixed').hide();
});

// when the checkbox for 'CHIRPS Layer' is clicked, show/hide the layer
$("#chirps").change(function () {
    if (this.checked) {
        $('#loading_fixed').show();
        chirpsTimeLayer.addTo(map);
        chirpsTimeLayer.bringToFront();
        var val = Math.round($('#opacity_chirps').val() * 100);
        $('#chirps_opacity').text(val + "%");
        $('#chirps_opacity').show();
        $('#opacity_chirps').show();
        add_legend_fixed_size("chirps", chirps_wms, chirps_variable, colorscalerange, style, 'legends');
    } else {
        chirpsTimeLayer.remove();
        $('#chirps_opacity').hide();
        $('#opacity_chirps').hide();
        remove_legend_fixed_size("chirps");
    }
});
// when the checkbox for 'ESI Layer' is clicked, show/hide the layer
$("#esi").change(function () {
    if (this.checked) {
        $('#loading_fixed').show();
        esi.addTo(map);
        esi.bringToFront();
        var val = Math.round($('#opacity_esi').val() * 100);
        $('#esi_opacity').text(val + "%");
        $('#esi_opacity').show();
        $('#opacity_esi').show();
        add_legend_fixed_size("esi", esi_wms, "", colorscalerange, style, 'legends');
    } else {
        esi.remove();
        $('#esi_opacity').hide();
        $('#opacity_esi').hide();
        remove_legend_fixed_size("esi");
    }
});
// when the opacity control for 'CHIRPS Layer' is selected, update the opacity
$('#opacity_chirps').change(function () {
    chirpsTimeLayer.setOpacity($(this).val());
    var val = Math.round($(this).val() * 100);
    $('#chirps_opacity').text(val + "%");
});
// when the opacity control for 'ESI Layer' is selected, update the opacity
$('#opacity_esi').change(function () {
    esi.setOpacity($(this).val());
    var val = Math.round($(this).val() * 100);
    $('#esi_opacity').text(val + "%");
});
// Remove all basemap layers from the map
removeLayers = function () {
    satellite.remove();
    osm.remove();
    OpenTopoMap.remove();
    terrainLayer.remove();
    deLormeLayer.remove();
    gSatLayer.remove();
};
// Add selected basemap layer to the map
add_basemap = function (map_name) {
    removeLayers();
    switch (map_name) {
        case "osm":
            osm.addTo(map);
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
// Add legend to the map for CHIRPS
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
        set_parent(legend, element);
    }
}
// Remove legend from the map
function remove_legend_fixed_size(val) {
    document.getElementById("legend_" + val).remove();
}
// Add legend to the map for ESI
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
    document.getElementById("legends").appendChild(div);

}
// Add the Search Control to the map
const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    showMarker: false, // optional: true|false  - default true
    showPopup: false,
    autoClose: true,
});
map.addControl(search);