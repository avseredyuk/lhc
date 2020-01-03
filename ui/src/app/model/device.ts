export class Device {
  id: number;
  token: string;
  name: string;
  enabled: boolean;
  config: Array<DeviceConfig>;
  exclusions: Array<DeviceReportDataExclusion>;
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