$('#loading_cserv').hide();
$("#selectFiles").change(function (event) {


    var uploadedFile = event.target.files[0];
    var ext = uploadedFile.name.split('.')[1];
    if (ext in ["geojson", "json"]) {
        alert("Wrong file type == " + uploadedFile.type);
        return false;
    }

    if (uploadedFile) {
        var readFile = new FileReader();
        readFile.onload = function (e) {

            var contents = e.target.result;
            var geom_data = contents;
            $('#loading_cserv').show();
            get_chart(geom_data);
            $('#loading_cserv').hide();

        };
        readFile.readAsText(uploadedFile);
    } else {
        console.log("Failed to load file");
    }
});


function get_chart(geom_data) {

    const xhr = ajax_call("get-timeseries-climateserv", {
        "dataset": ["CHIRP", "CHIRPS", "IMERG"],
        "operation": "Average",
        "startdate": "01/03/2018",
        "enddate": "01/10/2018",
        "interaction": "polygon",
        "geom_data": geom_data
    });
    xhr.done(function (result) {
        let series = [];
        let ds1 = "CHIRP";
        let ds2 = "CHIRPS";
        let ds3 = "IMERG";
        let vals = result;
        series = [{
            data: vals[ds1],
            name: ds1,
            color: "blue"
        },
            {
                data: vals[ds2],
                name: ds2,
                color: "green"
            },
            {
                data: vals[ds3],
                name: ds3,
                color: "black"
            }];

        $('#chart-container2').highcharts({
                chart: {
                    type: 'spline',
                    zoomType: 'x',
                    events: {
                        load: function () {
                            var label = this.renderer.label("Graph dates and times are in UTC time")
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
                    text: "Data from ClimateSERV",
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
                        text: "values"
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

            },
        );
    });

}