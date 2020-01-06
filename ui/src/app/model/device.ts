export class Device {
  id: number;
  token: string;
  name: string;
  enabled: boolean;
  config: Array<DeviceConfig>;
  exclusions: Array<DeviceReportDataExclusion>;

  isDeviceActive(): Boolean {
    console.log(this);
    return this.enabled;
  }
}

export class DeviceConfig {
  id: number;
  key: string;
  value: string;
}

export class DeviceReportDataExclusion {
	map: string;
	excluded: boolean;
}