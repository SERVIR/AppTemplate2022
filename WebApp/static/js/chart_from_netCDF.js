$('#loading').hide();
let geom_data = "";

$("#selectFiles").change(function (event) {
    var uploadedFile = event.target.files[0];

    var ext = uploadedFile.name.split('.')[1];
    if (ext in ["geojson", "json"]) {
        alert("Wrong file type == " + uploadedFile.type);
        return false;
    }

    if (uploadedFile) {
        $('#loading').show();
        var readFile = new FileReader();
        readFile.onload = function (e) {
            var contents = e.target.result;
            geom_data = contents;
            get_chart();
        };
        readFile.readAsText(uploadedFile);
    } else {
        console.log("Failed to load file");
    }
});

function get_chart() {

    const xhr = ajax_call("get-timeseries-netcdf", {
        "variable": "BC_MLPM25",
        "dataset": "geos",
        "date": "20191123",
        "interaction": "polygon",
        "geom_data": geom_data//"[[95.734863,18.16673],[95.734863,18.646245],[96.174316,18.646245],[96.174316,18.16673],[95.734863,18.16673]]"
    });
    xhr.done(function (result) {
        let series = [
            {
                data: result.plot,
                name: "PM2.5",
                color: "blue"
            }];


        $('#chart-container').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x',
                events: {
                    load: function () {
                        var label = this.renderer.label($("#run_table option:selected").val() == "geos" ? "Graph dates and times are in Indian Std. Time" : "Graph dates and times are in UTC time")
                            .css({
                                width: '400px',
                                fontSize: '12px'
                            })
                            .attr({
                                'stroke': 'silver',
                                'stroke-width': 1,
                                'r': 2,
                                'padding': 5
                            })
                            .add();

                        label.align(Highcharts.extend(label.getBBox(), {
                            align: 'center',
                            x: 20, // offset
                            verticalAlign: 'bottom',
                            y: 0 // offset
                        }), null, 'spacingBox');

                    }
                },
                paddingBottom: 50
            },
            tooltip: {
                backgroundColor: '#FCFFC5',
                borderColor: 'black',
                borderRadius: 10,
                borderWidth: 3
            },
            title: {
                text: "Timeseries Data",
                style: {
                    fontSize: '14px'
                }
            },
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
            yAxis: {
                title: {
                    useHTML: true,
                    text: "Units"
                },
                plotBands: [],

            },
            plotOptions: {
                series: {
                    color: "black"
                }
            },
            exporting: {
                enabled: true
            },
            series: series

        });
    });
    $('#loading').hide();
}