const loading_sql = $('#loading_sql');
// When a station is selected, get the data for chart using get_chart function.
$("#stations").change(function () {
    // Show the loading spinner
    loading_sql.show();
    // ajax call to get the data for the selected station from the SQLite database
    const xhr = ajax_call("get-timeseries-sqlite", {
        "station": this.value
    });
    xhr.done(function (result) {// result is a dictionary with keys as dataset names and values as list of values for each day
        let series = [
            {
                data: result.plot_temp,// list of temperature values for each day for the selected station
                name: "Temperature",
                color: "green",
                yAxis: 0
            },
            {
                data: result.plot_precip,// list of precipitation values for each day for the selected station
                name: "Precipitation",
                color: "lightblue",
                yAxis: 1
            }];

        // Create the chart
        $('#chart-container3').highcharts({
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
                text: "Temperature & Precipitation (sample data)",
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
                noData: "No Data Found, Please try with a different station."
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
    loading_sql.hide();
});