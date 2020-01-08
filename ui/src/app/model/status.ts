export class Status {
  gauges: Array<GaugeData>;
  lastPings: Array<Object>;
  lastPumps: Array<Object>;
  lastBootups: Array<Object>;
}

export class GaugeData {
	deviceName: string;
	dataType: string;
	value: string;
}