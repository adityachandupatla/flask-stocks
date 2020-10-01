function createChart(chartdata, tickerbox) {
    area_chart_data = [];
    bar_chart_data = [];
    date_hashtable = [];
    max_y1 = 0;
    min_y2 = Number.MAX_SAFE_INTEGER;
    max_y2 = 0;
    todays_date = new Date().toLocaleString('en-GB').substr(0,10).replaceAll("/", "-").split("-").reverse().join("-");
    for (var i = 0;i < chartdata.length;++i) {
        x = new Date(chartdata[i]["Date"]).getTime();
        y1 = chartdata[i]["Stock Price"];
        y2 = chartdata[i]["Volume"];
        
        area_chart_data.push([x, y1]);
        bar_chart_data.push([x, y2]);
        
        date_hashtable.push(x);

        max_y1 = Math.max(max_y1, y1);

        min_y2 = Math.min(min_y2, y2);
        max_y2 = Math.max(max_y2, y2);
    }

    Highcharts.stockChart('chart_area', {

        title: {
            text: "Stock Price " + tickerbox.toUpperCase() + " " + todays_date
        },

        subtitle: {
            text: "<a target='_blank' rel='noopener noreferrer' href='https://api.tiingo.com/'>Source: Tiingo</a>",
            useHTML: true
        },

        rangeSelector: {
            buttons: [
                {
                    type: 'day',
                    count: 7,
                    text: '7d'
                },
                {
                    type: 'day',
                    count: 15,
                    text: '15d'
                },
                {
                    type: 'month',
                    count: 1,
                    text: '1m'
                },
                {
                    type: 'month',
                    count: 3,
                    text: '3m'
                },
                {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }
            ],
            selected: 4,
            inputEnabled: false
        },

        xAxis: {
            type: 'datetime',
            tickmarkPlacement: 'on',
            rotation: 0,
            align: 'top',
            labels: {
                formatter: function () {
                    const month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var utc_date = new Date(this.value);
                    utc_date.setDate(utc_date.getDate() + 1);
                    return utc_date.getDate() + "." + month_names_short[utc_date.getMonth()];
                }
            },
            tickPositioner: function() {
                var positions = [];
                var ticksSpacing = 28 * 24 * 3600 * 1000; // 28 days interval separation

                for (var x = this.dataMax; x >= this.dataMin; x -= ticksSpacing) {
                    if (date_hashtable.includes(x)) {
                        positions.push(x);
                    }
                }
                return positions.reverse();
            },
            events: {
                setExtremes: function(e) {
                    if (e.trigger === "rangeSelectorButton") {

                        var ticksSpacing;
                        if (e.rangeSelectorButton.text === '7d' || e.rangeSelectorButton.text === '15d') {
                            ticksSpacing = 24 * 3600 * 1000; // 1 day interval separation
                        }
                        else if (e.rangeSelectorButton.text === '1m') {
                            ticksSpacing = 4 * 24 * 3600 * 1000; // 4 days interval separation
                        }
                        else if (e.rangeSelectorButton.text === '3m') {
                            ticksSpacing = 14 * 24 * 3600 * 1000; // 14 days interval separation
                        }
                        else if (e.rangeSelectorButton.text === '6m') {
                            ticksSpacing = 28 * 24 * 3600 * 1000; // 28 days interval separation
                        }

                        this.update({
                            tickPositioner: function() {
                                var positions = [];
                                for (var x = e.max; x >= e.min; x -= ticksSpacing) {
                                    if (date_hashtable.includes(x)) {
                                        positions.push(x);
                                    }
                                }
                                return positions.reverse();
                            }
                        }, false);
                    }
                }
            }
        },

        yAxis: [
            {
                title: {
                    text: 'Stock Price'
                },
                min: 0,
                max: max_y1,
                opposite: false
            }, 
            {
                title: {
                    text: 'Volume'
                },
                min: min_y2,
                max: max_y2,
                opposite: true
            }
        ],

        plotOptions: {
            series: {
                pointWidth: 3,
                pointPlacement: 'on'
            }
        },

        series: [
            {
                name: tickerbox.toUpperCase(),
                type: 'area',
                data: area_chart_data,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                yAxis: 0
            },
            {
                name: tickerbox.toUpperCase() + " Volume",
                type: 'column',
                data: bar_chart_data,
                yAxis: 1
            }
        ]
    });
}