export class Device {
  id: number;
  token: string;
  name: string;
  enabled: boolean;
  config: Array<DeviceConfig>;
  exclusions: Array<DeviceReportDataExclusion>;
}

export class DeviceConfig {
  constructor(key: string, value: string, type: string) {
    this.key = key;
    this.value = value;
    this.type = type;
  }
  id: number;
  key: string;
  value: string;
  type: string;
}

export class DeviceReportDataExclusion {
  constructor(map: string) {
    this.map = map;
  }
	map: string;
}
