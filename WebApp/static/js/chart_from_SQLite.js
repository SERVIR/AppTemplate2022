$('#loading_sql').hide();

const xhr_stations = ajax_call("stations", {});
xhr_stations.done(function (result) {
        console.log(result.stations);
        $('#stations').append("<option value='default'>Select</option>");

        result.stations.map(function (st) {
            $('#stations').append("<option value='" + st.station_id + "'>" + st.station_name + "</option>");

        });


    }
);
$("#stations").change(function () {
    $('#loading_sql').show();

    const xhr = ajax_call("get-timeseries-sqlite", {
        "variable": "BC_MLPM25",
        "dataset": "geos",
        "date": "20191123",
        "interaction": "polygon",
        "geom_data": "[[95.734863,18.16673],[95.734863,18.646245],[96.174316,18.646245],[96.174316,18.16673],[95.734863,18.16673]]",
        "station": this.value
    });
    xhr.done(function (result) {

        let series = [
            {
                data: result['plot'],
                name: "Temperature",
                color: "green",
                yAxis: 0
            },
            {
                data: result['plot1'],
                name: "Precipitation",
                color: "lightblue",
                yAxis: 1
            }];


        $('#chart-container3').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x',
                paddingBottom: 50
            },
            tooltip: {
                backgroundColor: '#FCFFC5',
                borderColor: 'black',
                borderRadius: 10,
                borderWidth: 3
            },
            title: {
                text: "Temperature & Precipitation (sample data)",
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
            series: series,
            lang: {
                noData: "No Data Found, Please try again with different geojson."
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            }

        });
    });
    $('#loading_sql').hide();
});