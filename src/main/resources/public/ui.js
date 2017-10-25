$(function () {
  var historyUri = '/history';

  var currentTime = new Date();
  var tzOffset = currentTime.getTimezoneOffset();

  var array_temperature = [];
  var array_water_temperature = [];
  var array_humidity = [];
  var array_pump = [];
  var array_bootup = [];

  var tempDelta = 0.5;
  var humidDelta = 0.5;

  Highcharts.setOptions({
    global: {
      timezoneOffset: tzOffset
    }
  });

  $.getJSON(historyUri, function(history) {

    var data = history.bootups;
    var items = [];
    for (i = 0; i < data.length; i++) {
      var item = '<li><span>' + timestampFormat(data[i].d) + '</span></li>';
      items.push(item);
      array_bootup.push([data[i].d, 1]);
    }
    $('#last_bootups_list ul').append(items.join(''));

    data = history.pumps;
    for (i = data.length - 1; i >= 0; i--) {
      var pump_value;
      if (data[i].a == 'ENABLED') {
        pump_value = 1;
      } else {
        pump_value = 0;
      }
      array_pump.push([data[i].d, pump_value]);
    }

    data = history.reports;
    for (i = data.length - 1; i >= 0; i--) {
      array_temperature.push([data[i].d, data[i].t]);
      array_water_temperature.push([data[i].d, data[i].w]);
      array_humidity.push([data[i].d, data[i].h]);
    }

    var lastDataFromLHC = calculateLastActionTime();
    var uptime = calculateUptime();

    $('#uptime').text(uptime);

    $('#lastReport').text(timestampFormat(array_temperature[array_temperature.length - 1][0]));

    $('#lastPump').text(timestampFormat(array_pump[array_pump.length - 1][0]));

    var uptimeChart = Highcharts.chart('uptimeChart', {
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },
      title: {
        text: ""
      },
      xAxis: [{
        type: 'datetime',
        max: currentTime.getTime(),
        tickInterval: 3600 * 1000,
        plotLines: [{
          color: Highcharts.getOptions().colors[8],
          dashStyle: 'solid',
          value: currentTime.getTime(),
          width: 1
        }]
      }],
      yAxis: [{
        min: 0,
        max: 1,
        labels: {
          enabled: false
        },
        title: {
          text: ""
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        gridLineColor: 'transparent',
        minorTickLength: 0,
        tickLength: 0
      }],
      series: [{
        type: 'line',
        name: 'Boot-Ups',
        data: array_bootup
      }]
    });

    if (array_bootup.length > 0) {
      for (i = 0; i < array_bootup.length - 1; i++) {
        var colorIndex = (i % 2 == 1) ? 3 : 2;
        addPlotBand(
            array_bootup[i + 1][0],
            array_bootup[i][0],
            Highcharts.getOptions().colors[colorIndex]
        );
      }
      addPlotBand(
          array_bootup[0][0],
          lastDataFromLHC,
          Highcharts.getOptions().colors[4]
      );
    }

    var mainChart = Highcharts.chart('mainChart', {
      title: {
        text: ""
      },
      xAxis: [{
        type: 'datetime',
        max: currentTime.getTime(),
        tickInterval: 1800 * 1000,
        plotLines: [{
          color: Highcharts.getOptions().colors[8],
          dashStyle: 'solid',
          value: currentTime.getTime(),
          width: 1
        }]
      }],
      yAxis: [{
        min: Math.min(
            Math.floor(Math.min.apply(Math, array_water_temperature.map(function (o) {
                  return o[1];
                })) - tempDelta),
            Math.floor(Math.min.apply(Math, array_temperature.map(function (o) {
                  return o[1];
                })) - tempDelta)),
        max: Math.max(
            Math.ceil(Math.max.apply(Math, array_water_temperature.map(function (o) {
                  return o[1];
                })) + tempDelta),
            Math.ceil(Math.max.apply(Math, array_temperature.map(function (o) {
                  return o[1];
                })) + tempDelta)),
        title: {
          text: ""
        },
        tickInterval: 1
      }, {
        min: Math.floor(Math.min.apply(Math, array_humidity.map(function (o) {
              return o[1];
            })) - humidDelta),
        max: Math.ceil(Math.max.apply(Math, array_humidity.map(function (o) {
              return o[1];
            })) + humidDelta),
        title: {
          text: ""
        },
        opposite: true,
        tickInterval: 1
      }, {
        min: 0,
        max: 1.0,
        labels: {
          enabled: false
        },
        title: {
          text: ""
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        gridLineColor: 'transparent',
        minorTickLength: 0,
        tickLength: 0
      }],
      series: [
        {
          yAxis: 2,
          type: 'area',
          name: 'Pump',
          color: '#e1e1e1',
          data: array_pump,
          step: 'left'
        }, {
          type: 'line',
          name: 'Air Temperature',
          color: Highcharts.getOptions().colors[2],
          data: array_temperature
        }, {
          type: 'line',
          name: 'Water Temperature',
          color: Highcharts.getOptions().colors[4],
          data: array_water_temperature
        }, {
          yAxis: 1,
          type: 'line',
          name: 'Humidity',
          color: Highcharts.getOptions().colors[5],
          data: array_humidity
        }]
    });

    function addPlotBand(from, to, color) {
      uptimeChart.xAxis[0].addPlotBand({
        color: color,
        from: from,
        to: to,
        label: {
          text: formatInterval(getIntervalDifference(from, to)),
          align: 'center',
          rotation: 90,
          textAlign: 'left'
        }
      });
    }

    function timestampFormat(timestamp) {
      var localeId = 'uk-UA';
      return new Date(timestamp).toLocaleString(localeId);
    }

    function calculateLastActionTime() {
      return Math.max(array_pump[array_pump.length - 1][0], array_temperature[array_temperature.length - 1][0]);
    }

    function calculateUptime() {
      var lastBootupTime = array_bootup[0][0];
      if ((lastDataFromLHC == 0) || (lastBootupTime == 0)) {
        return "no data";
      }
      if (lastBootupTime > lastDataFromLHC) {
        return "no data";
      }
      return formatInterval(getIntervalDifference(lastBootupTime, lastDataFromLHC));
    }

    function formatInterval(array) {
      return array[0] + "d " + pad(array[1], 2) + "h " + pad(array[2], 2) + "m " + pad(array[3], 2) + "s";
    }

    function getIntervalDifference(startDateTimestamp, endDateTimestamp) {
      var result = [];

      var different = endDateTimestamp - startDateTimestamp;

      var secondsInMilli = 1000;
      var minutesInMilli = secondsInMilli * 60;
      var hoursInMilli = minutesInMilli * 60;
      var daysInMilli = hoursInMilli * 24;

      result[0] = ~~(different / daysInMilli);
      different = different % daysInMilli;

      result[1] = ~~(different / hoursInMilli);
      different = different % hoursInMilli;

      result[2] = ~~(different / minutesInMilli);
      different = different % minutesInMilli;

      result[3] = ~~(different / secondsInMilli);

      return result;
    }

    function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    }

  });

});