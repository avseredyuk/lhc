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
