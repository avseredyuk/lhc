export class Season {
  id: number;
  name: string;
  deviceId: number;
  crops: Array<Crop>;
}

export class Crop {
	id: number;
	seasonId: number;
	weight: number;
	count: number;
	dateTime: number;
}