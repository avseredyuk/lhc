export class Season {
  id: number;
  name: string;
  deviceId: number;
  crops: Array<Crop>;
}

export class SeasonStatistics {
	totalCount: number;
	totalWeight: number;
	avgCropWeight: number;
}

export class Crop {
	id: number;
	seasonId: number;
	weight: number;
	count: number;
	d: number;
}