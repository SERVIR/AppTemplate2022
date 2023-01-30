const loading_nc = $('#loading_nc');
// When a geojson file is uploaded, read the file and get the data for chart using get_chart function.
$("#selectFiles").change(function (event) {
    const uploadedFile = event.target.files[0];

    const ext = uploadedFile.name.split('.')[1];
    if (ext in ["geojson", "json"]) {
        alert("Wrong file type == " + uploadedFile.type);
        return false;
    }

    if (uploadedFile) {
        // Show the loading spinner
        loading_nc.show();
        const readFile = new FileReader();
        readFile.onload = function (e) {
            get_chart(e.target.result);
        };
        readFile.readAsText(uploadedFile);
    } else {
        console.log("Failed to load file");
    }
});

// Function to get the data for chart using ajax call. Parameters are geom_data obtained from the uploaded geojson file.
function get_chart(geom_data) {
    // Modify the xhr call below in order to get the chart for different parameters
    const xhr = ajax_call("get-timeseries-netcdf", {
        "variable": "BC_MLPM25",
        "dataset": "geos",
        "date": "20191123",
        "interaction": "polygon",
        "geom_data": geom_data//"[[95.734863,18.16673],[95.734863,18.646245],[96.174316,18.646245],[96.174316,18.16673],[95.734863,18.16673]]"
    });
    xhr.done(function (result) {// result is a dictionary with keys as dataset names and values as list of values for each day
        let series = [
            {
                data: result.plot,// list of values for for BC_MLPM25
                name: "PM2.5",// name of the variable in the dataset
                color: "blue"
            }];

        // Create the chart
        $('#chart-container').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x',
                events: {
                    // When the chart is loaded, display a message under the chart
                    load: function () {
                        const label = this.renderer.label($("#run_table option:selected").val() === "geos" ? "Graph dates and times are in Indian Std. Time" : "Graph dates and times are in UTC time")
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
            // Set the tooltip text style when hovering on the chart
            tooltip: {
                backgroundColor: '#FCFFC5',
                borderColor: 'black',
                borderRadius: 10,
                borderWidth: 3
            },
            // Set the title and title text style
            title: {
                text: "Timeseries Data",
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
            // Set the series data
            series: series,
            // Set the text to display when no data is available
            lang: {
                noData: "No Data Found, Please try again with different geojson."
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
    // Hide the loading spinner
    loading_nc.hide();
}