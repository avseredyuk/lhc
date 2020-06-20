import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public dataTypes: Array<string> =
    ['FULL', 'SAMPLE', 'PARTIAL'];
  public deviceConfigKeys: Array<string> =
    ['PUMP_ENABLE_FREQUENCY', 'PUMP_DURATION', 'REPORT_SEND_FREQUENCY', 'RUN_PUMP_ONCE',
     'PUMP_COLOR', 'WATER_TEMPERATURE_COLOR', 'TEMPERATURE_COLOR', 'HUMIDITY_COLOR', 'ABS_HUMIDITY_COLOR'];
  public deviceConfigDataTypes: Array<string> =
    ['UI', 'DEVICE'];
  public deviceReportDataExclusionTypes: Array<string> =
    ['AIR_TEMP', 'WATER_TEMP', 'HUMIDITY', 'PUMP', 'ABS_HUMIDITY'];

  public VALIDATION_PATTERN_PH: string = "[0-9]{1,2}[,.]?[0-9]{0,2}";
  public VALIDATION_PATTERN_TDS: string = "[0-9]{1,5}";
  public VALIDATION_PATTERN_DEVICE_NAME: string = "[a-zA-Z -]{1,100}";
  public VALIDATION_PATTERN_DEVICE_TOKEN: string = "[a-zA-Z0-9]{1,100}";
  public VALIDATION_PATTERN_WEIGHT: string = "[0-9]{1,2}[,.]?[0-9]{0,2}";
  public VALIDATION_PATTERN_COUNT: string = "[0-9]{1,5}";

  formatTimestamp(timestamp: number): string {
    var localeId = 'uk-UA';
    return new Date(timestamp).toLocaleString(localeId);
  }

  formatTimeInterval(timestampOld: number): string {
    var timestamp = Math.floor((new Date().getTime() - timestampOld) / 1000) ;
    var days, hours, minutes, seconds;
    var _days = Math.floor(timestamp / 86400);
    timestamp %= 86400;
    var _hours = Math.floor(timestamp / 3600);
    timestamp %= 3600;
    var _minutes = Math.floor(timestamp / 60);
    var _seconds = timestamp % 60;
    if (_hours   < 10) {hours   = "0"+_hours;}   else {hours   = _hours;}
    if (_minutes < 10) {minutes = "0"+_minutes;} else {minutes = _minutes;}
    if (_seconds < 10) {seconds = "0"+_seconds;} else {seconds = _seconds;}
    if (_days > 0) {
      days = _days + " days "
    } else {
      days = "";
    }
    return days + hours + ':' + minutes + ':' + seconds;
  }

  getDateFromDateTime(timestamp: number): String {
    return new Date(timestamp).toISOString().slice(0,10);
  }

  getTimeFromDateTime(timestamp: number): String {
    return new Date(timestamp).toISOString().slice(11,19);
  }

  convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  combineDateAndTime(date, time) {
    var timeString = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateString = '' + year + '-' + month + '-' + day;
    var combined = new Date(dateString + ' ' + timeString);
    return combined;
  };

  isCurrentPage(currentPage, pageNumber) {
    return currentPage == pageNumber;
  }

  isPointsOrCurrentPage(currentPage, pageNumber) {
    return this.isCurrentPage(currentPage, pageNumber) || currentPage == '...';
  }

  pagination(c, m): Array<string> {
    var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;
    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }
    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }
    return rangeWithDots;
}


}
