export class PlantMaintenance {
  id: number;
  d: number;
  deviceId: number;
  maintenanceType: string;
  ph: number;
  tds: number;
  details: Array<PlantMaintenanceDetail>;
}

export class PlantMaintenanceDetail {
  constructor(key:string, value:string) {
    this.key = key;
    this.value = value;
  }
  id: number;
  key: string;
  value: string;
}