export class Status {
  gauges: Array<GaugeData>;
  lastPings: Object;
  lastPumps: Object;
  lastBootups: Object;
}

export class GaugeData {
  deviceName: string;
  dataType: string;
  value: string;
}
