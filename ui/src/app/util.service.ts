import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public dataTypes: Array<string> = ['FULL', 'SAMPLE', 'PARTIAL'];

  formatTimestamp(timestamp: number): string {
    var localeId = 'uk-UA';
    return new Date(timestamp).toLocaleString(localeId);
  }

}
