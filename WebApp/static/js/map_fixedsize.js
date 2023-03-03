const opacity_chirps = $('#opacity_chirps');
const chirps_opacity = $('#chirps_opacity');
const opacity_esi = $('#opacity_esi');
const esi_opacity = $('#esi_opacity');
const loading_fixed = $('#loading_fixed');
let map;
// Variables for the WMS layers
const chirps_variable = 'precipitation_amount';
const style = 'boxfill/apcp_surface';
const colorscalerange = '0,5';

$(function () {
// Initialize with map control with basemap and time slider
    map = L.map('map', {
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

    // Initialize the WMS layers
    const chirpsTimeLayer = L.timeDimension.layer.wms(chirps, {
        updateTimeDimension: true
    });
    chirpsTimeLayer.on('timeload', function () {
        loading_fixed.hide();
    });

    esi.on('load', function () {
        loading_fixed.hide();
    });

    $("#chirps").change(function () {
        if (this.checked) {
            loading_fixed.show();
            chirpsTimeLayer.addTo(map);
            chirpsTimeLayer.bringToFront();
            chirps_opacity.text(Math.round(opacity_chirps.val() * 100) + "%");
            chirps_opacity.show();
            opacity_chirps.show();
            add_legend_fixed_size("chirps", chirps_wms, chirps_variable, colorscalerange, style, 'legends');
        } else {
            chirpsTimeLayer.remove();
            chirps_opacity.hide();
            opacity_chirps.hide();
            remove_legend_fixed_size("chirps");
        }
    });
// when the checkbox for 'ESI Layer' is clicked, show/hide the layer
    $("#esi").change(function () {
        if (this.checked) {
            loading_fixed.show();
            esi.addTo(map);
            esi.bringToFront();
            esi_opacity.text(Math.round(opacity_esi.val() * 100) + "%");
            esi_opacity.show();
            opacity_esi.show();
            add_legend_fixed_size("esi", esi_wms, "", colorscalerange, style, 'legends');
        } else {
            esi.remove();
            esi_opacity.hide();
            opacity_esi.hide();
            remove_legend_fixed_size("esi");
        }
    });
// when the opacity control for 'CHIRPS Layer' is selected, update the opacity
    opacity_chirps.change(function () {
        chirpsTimeLayer.setOpacity($(this).val());
        chirps_opacity.text(Math.round($(this).val() * 100) + "%");
    });
// when the opacity control for 'ESI Layer' is selected, update the opacity
    opacity_esi.change(function () {
        esi.setOpacity($(this).val());
        esi_opacity.text(Math.round($(this).val() * 100) + "%");
    });

    // Add the Search Control to the map
    map.addControl(new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
        showMarker: false, // optional: true|false  - default true
        showPopup: false,
        autoClose: true,
    }));

});


// when the checkbox for 'CHIRPS Layer' is clicked, show/hide the layer

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
        $.ajax({
            url: wms + "/legend?f=json",
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
        const legend = L.control({});
        const link = wms + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&LAYER=" + variable + "&colorscalerange=" + colorscalerange + "&PALETTE=" + palette + "&transparent=TRUE";
        legend.onAdd = function () {
            const src = link;
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML +=
                '<img src="' + src + '" alt="legend">';
            div.id = "legend_" + dataset;
            div.className = "thredds-legend";
            return div;
        };
        legend.addTo(map);
        set_parent(legend, element);


        var xx = document.createElement("a");
        xx.id = "a_chirps";
        xx.href = "#";
        var t = document.createTextNode(dataset);
        xx.appendChild(t);
        var x = document.createElement("div");
        x.appendChild(xx);
        x.style.clear = "both";

        document.getElementById("legends").insertBefore(x, document.getElementById("legend_" + dataset));
        var linebreak = document.createElement("br");
        document.getElementById("legend_" + dataset).appendChild(linebreak);

        document.getElementById("a_chirps").addEventListener("click", function () {

            document.getElementById("legend_chirps").classList.toggle("legend-zeroheight");
        });
    }
}

// Remove legend from the map
function remove_legend_fixed_size(val) {
    document.getElementById("legend_" + val).remove();

    document.getElementById("a_" + val).remove();
}

// Add legend to the map for ESI
function add_other_legend(response, dataset, base_service_url) {
    let htmlString = "<table id='esi_table'>";
    for (let iCnt = 0; iCnt < response.layers.length; iCnt++) {
        const lyr = response.layers[iCnt];
        if (lyr.layerId === 3) {
            if (lyr.legend.length > 1) {
                htmlString += "<tr><td colspan='2' style='font-weight:bold;'>" + dataset + "</td></tr>";
                for (let jCnt = 0; jCnt < lyr.legend.length; jCnt++) {
                    const src = base_service_url + "/" + lyr.layerId + "/images/" + lyr.legend[jCnt].url;
                    const strlbl = lyr.legend[jCnt].label.replace("<Null>", "Null");
                    htmlString += "<tr><td><img src=\"" + src + "\" alt ='' /></td><td>" + strlbl + "</td></tr>";
                }
            } else {
                htmlString += "<tr><td colspan='2' class='tdLayerHeader' style='font-weight:bold;'>" + dataset + "</td></tr>";
                const img_src = base_service_url + "/" + lyr.layerId + "/images/" + lyr.legend[0].url;
                htmlString += "<tr><td colspan='2' ><img src=\"" + img_src + "\" alt ='' /></td></tr>";
            }
        }
    }
    htmlString += "</table>";

    const div = document.createElement('div');
    div.innerHTML += htmlString;
    div.id = "legend_" + dataset;
    div.className = "arcgis-legend";
    document.getElementById("legends").appendChild(div);

    var xx = document.createElement("a");
    xx.id = "a_esi";
    xx.href = "#";
    var x = document.createElement("div");
    x.appendChild(xx);
    x.style.clear = "both";

    var t = document.createTextNode(dataset);
    xx.appendChild(t);

    document.getElementById("legends").insertBefore(x, document.getElementById("legend_" + dataset));

    document.getElementById("a_esi").addEventListener("click", function () {
        document.getElementById("legend_esi").classList.toggle("arcgis-legend");

        document.getElementById("esi_table").classList.toggle("legend-collapse");
    });

}