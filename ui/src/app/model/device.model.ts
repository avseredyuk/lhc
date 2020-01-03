export class Device {
  id: number;
  token: string;
  name: string;
  enabled: boolean;
  config: Array<DeviceConfig>;
}

export class DeviceConfig {
  id: number;
  key: string;
  value: string;
}