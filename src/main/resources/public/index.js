$(function () {
  var historyUri = '/history';

  var currentTime = new Date();
  var tzOffset = currentTime.getTimezoneOffset();

  Highcharts.setOptions({
    global: {
      timezoneOffset: tzOffset
    }
  });

  var array_temperature_global = new Object();
  var array_water_temperature_global = new Object();
  var array_humidity_global = new Object();
  var array_absolute_humidity_global = new Object();
  var array_pump_global = [];
  var array_bootup_global = [];
  var array_keys_global = [];

  $.getJSON(historyUri, function(history) {

    for (var key in history) {
      array_keys_global.push(key);
      var array_temperature = undefined;
      var array_water_temperature = undefined;
      var array_humidity = undefined;
      var array_absolute_humidity = undefined;
      var array_pump = [];
      var array_bootup = [];

      var data = history[key].bootups;
      var items = [];
      for (i = 0; i < data.length; i++) {
        var item = '<li><span>' + timestampFormat(data[i].d) + '</span></li>';
        items.push(item);
        array_bootup.push([data[i].d, 1]);
      }
      array_bootup_global.push(array_bootup);

      $('#last_bootups_list ul').append("<b>" + key + "</b>").append(items.join(''));

      data = history[key].pumps;
      for (i = data.length - 1; i >= 0; i--) {
        var pump_value;
        if (data[i].a == 'ENABLED') {
          pump_value = 1;
        } else {
          pump_value = 0;
        }
        array_pump.push([data[i].d, pump_value]);
      }
      array_pump_global.push(array_pump);

      data = history[key].reports;
      var lastTimestampFromReport;
      for (i = data.length - 1; i >= 0; i--) {
        if (data[i].t !== undefined) {
          if (array_temperature === undefined) {
            array_temperature = [];
          }
          array_temperature.push([data[i].d, data[i].t]);
        }
        if (data[i].w !== undefined) {
          if (array_water_temperature === undefined) {
            array_water_temperature = [];
          }
          array_water_temperature.push([data[i].d, data[i].w]);
        }
        if (data[i].h !== undefined) {
          if (array_humidity === undefined) {
            array_humidity = [];
          }
          array_humidity.push([data[i].d, data[i].h]);
        }
        if ((data[i].t !== undefined) && (data[i].h !== undefined)) {
          if (array_absolute_humidity === undefined) {
            array_absolute_humidity = [];
          }
          array_absolute_humidity.push([data[i].d, calcAbsH(data[i].t, data[i].h)]);
        }
        lastTimestampFromReport = data[i].d;
      }

      array_temperature_global[key] = array_temperature;
      array_water_temperature_global[key] = array_water_temperature;
      array_humidity_global[key] = array_humidity;
      array_absolute_humidity_global[key] = array_absolute_humidity;

      var lastDataFromLHC = calculateLastActionTime(array_pump, lastTimestampFromReport);
      var uptime = calculateUptime(array_bootup, lastDataFromLHC);
      $('#uptime').append("<b>" + key + "</b>").append("<br/>").append(uptime).append("<br/>").append("<br/>");
      $('#lastReport').append("<b>" + key + "</b>").append("<br/>").append(timestampFormat(lastTimestampFromReport)).append("<br/>").append("<br/>");
      $('#lastPump').append("<b>" + key + "</b>").append("<br/>").append(timestampFormat(array_pump[array_pump.length - 1][0])).append("<br/>").append("<br/>");

      //todo: uptime chart works only for last device
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
    }

    var mainChart = Highcharts.chart('mainChart', {
      title: {
        text: ""
      },
      legenxd: {
        useHTML: true
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
        title: {
          text: ""
        },
        opposite: true,
        tickInterval: 1
      }, {
        title: {
          text: ""
        },
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
      }, {
        title: {
          text: ""
        },
        tickInterval: 1
      }]
    });

    for (i = 0; i < array_keys_global.length; i++) {
      var k = array_keys_global[i];
      mainChart.addSeries({
        yAxis: 2,
        type: 'area',
        name: 'Pump (' + k + ')',
        data: array_pump_global[i],
        step: 'left'
      });
      if (array_temperature_global[k] !== undefined) {
        mainChart.addSeries({
          type: 'line',
          name: 'Air Temperature, C (' + k + ')',
          data: array_temperature_global[k]
        });
      }
      if (array_water_temperature_global[k] !== undefined) {
        mainChart.addSeries({
          type: 'line',
          name: 'Water Temperature, C (' + k + ')',
          data: array_water_temperature_global[k]
        });
      }
      if (array_humidity_global[k] !== undefined) {
        mainChart.addSeries({
          yAxis: 1,
          type: 'line',
          name: 'Humidity, % (' + k + ')',
          data: array_humidity_global[k]
        });
      }
      if (array_absolute_humidity_global[k] !== undefined) {
        mainChart.addSeries({
          yAxis: 3,
          type: 'line',
          name: 'Abs. Humidity, g/m<sup>3</sup> (' + k + ')',
          data: array_absolute_humidity_global[k]
        });
      }

    }

  });

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

  function calcAbsH(t, h) {
    if ((t == null) || (h == null)) {
      return null;
    }
    var tmp;
    var absHumid;
    tmp = Math.pow(2.718281828,(17.67*t)/(t+243.5));
    absHumid = (6.112*tmp*h*2.1674)/(273.15+t);
    return Math.round(absHumid * 100) / 100;
  }

  function calculateUptime(array_bootup_local, lastDataFromLHC_local) {
    var lastBootupTime = array_bootup_local[0][0];
    if ((lastDataFromLHC_local == 0) || (lastBootupTime == 0)) {
      return "no data";
    }
    if (lastBootupTime > lastDataFromLHC_local) {
      return "no data";
    }
    return formatInterval(getIntervalDifference(lastBootupTime, lastDataFromLHC_local));
  }

  function calculateLastActionTime(array_pump_local, lastReportTimestamp) {
    return Math.max(array_pump_local[array_pump_local.length - 1][0], lastReportTimestamp);
  }

  function timestampFormat(timestamp) {
    var localeId = 'uk-UA';
    return new Date(timestamp).toLocaleString(localeId);
  }
});