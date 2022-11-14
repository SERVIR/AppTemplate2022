
    const xhr = ajax_call("get-timeseries-sqlite", {
        "variable": "BC_MLPM25",
        "dataset": "geos",
        "date": "20191123",
        "interaction": "polygon",
        "geom_data": "[[95.734863,18.16673],[95.734863,18.646245],[96.174316,18.646245],[96.174316,18.16673],[95.734863,18.16673]]"
    });
    xhr.done(function (result) {
        let series = [
            {
                data: result['plot'],
                name: "1st",
                color: "blue",
                yAxis: 0
            },
        {
                data: result['plot1'],
                name: "2nd",
                color: "blue",
                yAxis: 1
            }];


        $('#chart-container3').highcharts({
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
                text: "Data from SQLite",
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
            yAxis: [{},{}],
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
