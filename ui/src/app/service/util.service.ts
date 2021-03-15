import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public dataTypes: Array<string> =
    ['FULL', 'SAMPLE', 'PARTIAL'];
  public deviceConfigKeys: Array<string> =
    ['PUMP_ENABLE_FREQUENCY', 'PUMP_DURATION', 'REPORT_SEND_FREQUENCY', 'RUN_PUMP_ONCE', 'RELAY_PIN', 'WATER_TEMP_PIN', 'AIR_TEMP_HUM_PIN',
     'PUMP_COLOR', 'WATER_TEMPERATURE_COLOR', 'TEMPERATURE_COLOR', 'HUMIDITY_COLOR', 'ABS_HUMIDITY_COLOR'];
  public deviceConfigDataTypes: Array<string> =
    ['UI', 'DEVICE'];
  public deviceReportDataExclusionTypes: Array<string> =
    ['AIR_TEMP', 'WATER_TEMP', 'HUMIDITY', 'PUMP', 'ABS_HUMIDITY'];

  public VALIDATION_PATTERN_PH: string = "[0-9]{1,2}[,.]?[0-9]{0,2}";
  public VALIDATION_PATTERN_TDS: string = "[0-9]{1,5}";
  public VALIDATION_PATTERN_DEVICE_NAME: string = "[0-9a-zA-Z -]{1,100}";
  public VALIDATION_PATTERN_DEVICE_TOKEN: string = "[a-zA-Z0-9]{1,100}";
  public VALIDATION_PATTERN_WEIGHT: string = "[0-9]{1,2}[,.]?[0-9]{0,2}";
  public VALIDATION_PATTERN_COUNT: string = "[0-9]{1,5}";
  public VALIDATION_PATTERN_SEASON_NAME: string = ".{1,100}";

  public PAGINATED_COMPONENT_PLANT_MAINTENANCE_LIST = 'PLANT_MAINTENANCE_LIST';
  public PAGINATED_COMPONENT_SEASON_VIEW = 'SEASON_VIEW';
  public PAGINATED_COMPONENT_SEASON_LIST = 'SEASON_LIST';
  public PAGINATED_COMPONENT_SETTINGS_LIST = 'SETTINGS_LIST';
  public PAGINATED_COMPONENT_DEVICE_LIST = "DEVICE_LIST";

  formatDeviceName(name: string, privateName: string): string {
    return privateName == null ? name : name + ' (' + privateName + ')';
  }

  formatTimestamp(timestamp: number): string {
    const localeId = 'uk-UA';
    return new Date(timestamp).toLocaleString(localeId);
  }

  formatTimeInterval(timestampOld: number): string {
    let timestamp = Math.floor((new Date().getTime() - timestampOld) / 1000) ;
    let days, hours, minutes, seconds;
    const _days = Math.floor(timestamp / 86400);
    timestamp %= 86400;
    const _hours = Math.floor(timestamp / 3600);
    timestamp %= 3600;
    const _minutes = Math.floor(timestamp / 60);
    const _seconds = timestamp % 60;
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

  getDateFromDateTime(timestamp: number): string {
    return new Date(timestamp).toISOString().slice(0,10);
  }

  getTimeFromDateTime(timestamp: number): string {
    return new Date(timestamp).toISOString().slice(11,19);
  }

  convertDateToUTC(date): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  combineDateAndTime(date, time): Date {
    const timeString = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateString = '' + year + '-' + month + '-' + day;
    const combined = new Date(dateString + ' ' + timeString);
    return combined;
  }

  roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

}
