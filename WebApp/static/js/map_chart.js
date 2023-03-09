// Helpers to show/hide the popovers when the info button is clicked
let map;

$(function () {

    function get_chart(station_name, startdate, enddate) {

        const xhr = ajax_call("get-timeseries-sqlite", {
            "station": station_name,
            "startdate": startdate,
            "enddate": enddate
        });
        xhr.done(function (result) {// result is a dictionary with keys as dataset names and values as list of values for each day
            let series = [
                {
                    data: result.plot_temp.sort((a, b) => a[0] - b[0]),// list of temperature values for each day for the selected station
                    name: "Temperature",
                    color: "green",
                    yAxis: 0
                },
                {
                    data: result.plot_precip.sort((a, b) => a[0] - b[0]),// list of precipitation values for each day for the selected station
                    name: "Precipitation",
                    color: "lightblue",
                    yAxis: 1
                }];
            // Create the chart
            console.log(series);
            $('#chart-container_new').highcharts({
                chart: {
                    type: 'spline',
                    zoomType: 'x',
                    paddingBottom: 50
                },
                // Set the tooltip text style when hovering on the chart
                tooltip: {
                    backgroundColor: '#FCFFC5',
                    borderColor: 'black',
                    borderRadius: 10,
                    borderWidth: 3
                },
                // Set the title and title text style
                title: {
                    text: "Temperature & Precipitation (" + station_name + ")",
                    style: {
                        fontSize: '14px'
                    }
                },
                // Set the xAxis(horizontal) and yAxis(vertical) labels and text style
                xAxis: {
                    type: 'datetime',
                    labels: {
                        format: '{value: %Y-%m-%d}'
                        // rotation: 45,
                        // align: 'left'
                    },
                    title: {
                        text: 'Date'

                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    y: -25
                },
                yAxis: [{
                    title: {
                        text: 'Temperature (\u00B0C)'
                    }
                }, {
                    title: {
                        text: 'Precipitation (mm)'
                    },
                    gridLineWidth: 0,
                    opposite: true
                }],
                plotOptions: {
                    series: {
                        color: "black"
                    }
                },
                exporting: {
                    enabled: true
                },
                // Set the series data
                series: series,
                // Set the text to display when no data is available
                lang: {
                    noData: "No Data Found, Please try with a different station/date range."
                },
                // Set the style of the text when no data is available
                noData: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px',
                        color: '#303030'
                    }
                }

            });


        });
    }

    const opacity_chirps = $('#opacity_chirps');
    const chirps_opacity = $('#chirps_opacity');
    const opacity_esi = $('#opacity_esi');
    const esi_opacity = $('#esi_opacity');
    const loading_fixed = $('#loading_mc');

// Variables for the WMS layers
    const chirps_variable = 'precipitation_amount';
    const style = 'boxfill/apcp_surface';
    const colorscalerange = '0,5';


// Initialize with map control with basemap and time slider
    map = L.map('map_chart', {
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
        }, center: [12.9719, 77.5937], zoom: 3
    });

    map.zoomControl.setPosition('topleft');
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
        }
    }

// Remove legend from the map
    function remove_legend_fixed_size(val) {
        document.getElementById("legend_" + val).remove();
    }

// Add legend to the map for ESI
    function add_other_legend(response, dataset, base_service_url) {
        let htmlString = "<table>";
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

    }

    this.$slideOut = $('#slideOut');

    // Slideout show
    this.$slideOut.find('.slideOutTab').on('click', function () {
        const center = map.getCenter();
        const zoom = map.getZoom();
        $("#slideOut").toggleClass('showSlideOut');
        $("#map_chart").toggleClass('slideMap');

        map.invalidateSize();
        map.setView([center.lat, center.lng], zoom, {animation: true});

        map.zoomControl.setPosition('topleft');

    });

    function markerOnClick(e) {
         const center = map.getCenter();
        const zoom = map.getZoom();
        $("#slideOut").addClass('showSlideOut');
        $("#map_chart").addClass('slideMap');

        map.invalidateSize();
        map.setView([center.lat, center.lng], zoom, {animation: true});

        map.zoomControl.setPosition('topleft');
        var customId = this.options.customId;

        // alert('cliked customId: ' + customId);
        get_chart(customId, document.getElementById('date_input_start').value, document.getElementById('date_input_end').value);
        gen_table(customId, document.getElementById('date_input_st').value, document.getElementById('date_input_en').value);

    }

    const xhr1 = ajax_call("get-station-coords", {});
    xhr1.done(function (result) {
        let i = 0;
        for (i = 0; i < result.stations.length; i++) {
            var markerOptions = {
                title: result.stations[i].station_name,
                clickable: true,
                draggable: true,
                customId: result.stations[i].station_name,
            };
            // Creating a marker
            L.marker([result.stations[i].station_lat, result.stations[i].station_lon], markerOptions).addTo(map).on('click', markerOnClick);
        }
    });
    get_chart("Sample Station ABCDE", document.getElementById('date_input_start').value, document.getElementById('date_input_end').value);
    var date_input_st = document.getElementById('date_input_st');
    date_input_st.valueAsDate = new Date();

    date_input_st.onchange = function () {
                if (this.value <= document.getElementById('date_input_en').value)

        gen_table("Sample Station ABCDE",this.value,document.getElementById('date_input_en').value);
                else
                    alert("Start date should be less than end date");

    };
        var date_input_en = document.getElementById('date_input_en');
    date_input_en.valueAsDate = new Date();

    date_input_en.onchange = function () {
                if (document.getElementById('date_input_st').value <= this.value)

        gen_table("Sample Station ABCDE",this.value,document.getElementById('date_input_en').value);
                else {
                    alert("Start date should be less than end date");
                }

    };

    var date_input_start = document.getElementById('date_input_start');
    date_input_start.valueAsDate = new Date();

    date_input_start.onchange = function () {
        console.log(this.value);
        if (this.value <= document.getElementById('date_input_end').value)

            get_chart("Sample Station ABCDE", this.value, document.getElementById('date_input_end').value);
        else {
            alert("Start date should be less than end date");
        }
    };

    var date_input_end = document.getElementById('date_input_end');
    date_input_end.valueAsDate = new Date();

    date_input_end.onchange = function () {

        if (document.getElementById('date_input_start').value <= this.value)

            get_chart("Sample Station ABCDE", document.getElementById('date_input_start').value, this.value);
        else {
            alert("Start date should be less than end date");
        }

    };
    function gen_table(station,startdate,enddate){
             const xhr1 = ajax_call("get-measurements", {"station":station,"startdate": startdate,"enddate": enddate});
        xhr1.done(function (result) {
            console.log(result['data']);

            var arr = [];
            for (let i = 0; i < result['data'].length; i++) {
                var station = result['data'][i]['station'];
                 var date = result['data'][i]['date'];
                var prec = result['data'][i]['precip'];
                var temp = result['data'][i]['temp'];
                arr.push({"station": station,"date":date, "prec": prec, "temp": temp});
            }


            const tableData = arr.map(value => {
                return (
                    `<tr>
       <td>${value.station}</td>
       <td>${value.date}</td>
       <td>${value.prec}</td>
       <td>${value.temp}</td>
    </tr>`
                );
            }).join('');

            const tableBody = document.querySelector("#tableBody");
            tableBody.innerHTML = tableData;
        });
    }


});