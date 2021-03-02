import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ComponentCommunicationService {
  private map: Map<string, any> = new Map();

  getValue(key: string): any {
    const value = this.map.get(key);
    this.map.delete(key);
    return value;
  }

  setValue(key: string, value: any): void {
    this.map.set(key, value);
  }

  getNotification(): any {
    return this.getValue("notification");
  }

  setNotification(notification: any): void {
    this.setValue("notification", notification);
  }

  getClonedMaintenance(): any {
    return this.getValue("clonedMaintenance");
  }

  setClonedMaintenance(cloned: any): void {
    this.setValue("clonedMaintenance", cloned);
  }

  getPageNumber(key: string): number {
    return this.getValue(key + "pageNumber");
  }

  setPageNumber(key: string, pageNumber: number): void {
    this.setValue(key + "pageNumber", pageNumber);
  }
}
