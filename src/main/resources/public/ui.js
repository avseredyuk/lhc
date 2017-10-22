$(function () {
      var currentTime = new Date();
      var tzOffset = currentTime.getTimezoneOffset();

      var array_temperature = [];
      var array_water_temperature = [];
      var array_humidity = [];
      var array_volume = [];
      var array_ppm = [];
      var array_pump = [];

      var tempDelta = 0.5;
      var humidDelta = 1.0;
      var volDelta = 1.0;
      var ppmDelta = 10.0;

      Highcharts.setOptions({
        global: {
          timezoneOffset: tzOffset
        }
      });

      $.getJSON('/history', function(history) {

          var data = history.bootups;
          var items = [];
          for (i = 0; i < data.length; i++) {
            var date = new Date(data[i].d);
            var item = '<li><span>' + date.toLocaleString('uk-UA') + '</span></li>';
            items.push(item);
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
            array_pump.push([data[i].t, pump_value]);
          }

          $('#container_pump').highcharts({
            title: {
              text: "Pump Actions"
            },
            xAxis: {
              type: 'datetime',
              pointInterval: 1000 * 60 * 60,
              max: currentTime.getTime()
            },
            yAxis: {
              title: {
                text: ""
              }
            },
            series: [{
              type: 'area',
              name: 'Pump',
              color: '#9a9a9a',
              data: array_pump,
              step: 'left'
            }]
          });

          data = history.reports;
          for (i = data.length - 1; i >= 0; i--) {
            array_temperature.push([data[i].d, data[i].t]);
            array_water_temperature.push([data[i].d, data[i].w]);
            array_humidity.push([data[i].d, data[i].h]);
            array_volume.push([data[i].d, data[i].v]);
            array_ppm.push([data[i].d, data[i].p]);
          }

          $('#container_temperature').highcharts({
            title: {
              text: "Temperature"
            },
            xAxis: {
              type: 'datetime',
              pointInterval: 1000 * 60 * 60,
              max: currentTime.getTime()
            },
            yAxis: {
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
              }
            },
            series: [
              {
                type: 'area',
                name: 'Air Temperature',
                color: '#bf4000',
                data: array_temperature
              },
              {
                type: 'area',
                name: 'Water Temperature',
                color: '#206fbf',
                data: array_water_temperature
              }]
          });

          $('#container_humidity').highcharts({
            title: {
              text: "Humidity"
            },
            xAxis: {
              type: 'datetime',
              pointInterval: 1000 * 60 * 60,
              max: currentTime.getTime()
            },
            yAxis: {
              min: Math.floor(Math.min.apply(Math, array_humidity.map(function (o) {
                    return o[1];
                  })) - humidDelta),
              max: Math.ceil(Math.max.apply(Math, array_humidity.map(function (o) {
                    return o[1];
                  })) + humidDelta),
              title: {
                text: ""
              }
            },
            series: [{
              type: 'area',
              name: 'Humidity',
              color: '#00a6bf',
              data: array_humidity
            }]
          });

          $('#container_volume').highcharts({
            title: {
              text: "Volume"
            },
            xAxis: {
              type: 'datetime',
              pointInterval: 1000 * 60 * 60,
              max: currentTime.getTime()
            },
            yAxis: {
              min: Math.floor(Math.min.apply(Math, array_volume.map(function (o) {
                    return o[1];
                  })) - volDelta),
              max: Math.ceil(Math.max.apply(Math, array_volume.map(function (o) {
                    return o[1];
                  })) + volDelta),
              title: {
                text: ""
              }
            },
            series: [{
              type: 'area',
              name: 'Volume',
              color: '#20bf00',
              data: array_volume
            }]
          });

          $('#container_ppm').highcharts({
            title: {
              text: "PPM"
            },
            xAxis: {
              type: 'datetime',
              pointInterval: 1000 * 60 * 60,
              max: currentTime.getTime()
            },
            yAxis: {
              min: Math.floor(Math.min.apply(Math, array_ppm.map(function (o) {
                    return o[1];
                  })) - ppmDelta),
              max: Math.ceil(Math.max.apply(Math, array_ppm.map(function (o) {
                    return o[1];
                  })) + ppmDelta),
              title: {
                text: ""
              }
            },
            series: [{
              type: 'area',
              name: 'PPM',
              color: '#bbbf00',
              data: array_ppm
            }]
          });

        $('#uptime').text(history.uptime);

      });

});