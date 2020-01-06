import {Component, OnInit, ViewChildren, QueryList} from "@angular/core";
import {Status} from "../model/status";
import {DataService} from "../data.service";
import {Gauge} from "src/assets/gauge.min.js";

@Component({
	selector: 'app-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
	objectKeys = Object.keys;
	status: Status;
	gaugeObjects: Array<Gauge> = [];
	gaugesInitialized: Boolean = false;

	@ViewChildren('gauges') gauges: QueryList<any>;

	gaugeOptions = {
		angle: 0.1,
		lineWidth: 0.1,
		limitMax: 'true',
		strokeColor: 'red',
		radiusScale: 1,
		generateGradient: true,
		pointer: {
			length: 0.5, // // Relative to gauge radius
			strokeWidth: 0.03, // The thickness
			color: 'orange' // Fill color
		},
		staticLabels: {
			font: "90% sans-serif",
			labels: [],
			color: "black"
		},
		staticZones: []
	};

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.dataService.getStatus().subscribe(
			data => this.status = data
			);
		setInterval(() => {
			this.updateGauges();
		}, 60000);
	}

	ngAfterViewInit() {
		this.gauges.changes.subscribe(t => {
			this.initGauges();
		})
	}

	formatTimestamp(timestamp: number): string {
		var localeId = 'uk-UA';
		return new Date(timestamp).toLocaleString(localeId);
	}

	formatGaugeMeasureUnit(dataType: string) {
		if (dataType === 'AIR_TEMP') {
			return " °C";
		} else if (dataType === 'HUMIDITY') {
			return " %";
		} else if (dataType === 'ABS_HUMIDITY') {
			return " g/m³";
		}
	}

	updateGauges() {
		this.dataService.getStatus().subscribe((data) => {
			this.gaugeObjects.forEach((gauge, i, array) => {
				let originalValue = +data.gauges[i].value;
				let roundedValue = Math.round(originalValue * 100) / 100;
				gauge.set(originalValue);
				gauge.canvas.nextElementSibling.innerText = String(roundedValue) + this.formatGaugeMeasureUnit(data.gauges[i].dataType);
			});
			this.status.lastReports = data.lastReports;
			this.status.lastPumps = data.lastPumps;
			this.status.lastBootups = data.lastBootups;
		});
	}

	initGauges() {
		if (this.gaugesInitialized) {
			return;
		}
		this.gaugesInitialized = true;
		this.status.gauges.forEach((gauge, i, array) => {
			let originalValue = +this.status.gauges[i].value;
			let roundedValue = Math.round(originalValue * 100) / 100;

			let localOptions =  JSON.parse(JSON.stringify(this.gaugeOptions));

			let minValue;
			let maxValue;
			if (gauge.dataType === 'AIR_TEMP') {
				minValue = 15;
				maxValue = 30;
				localOptions.staticLabels.labels = [15,18,21,24,27,30];
				localOptions.staticZones = [
				{strokeStyle: "#004478", min: 15, max: 20},
				{strokeStyle: "#2E78BC", min: 20, max: 25},
				{strokeStyle: "#88C5F7", min: 25, max: 30}
				]
			} else if (gauge.dataType === 'HUMIDITY') {
				minValue = 20;
				maxValue = 90;
				localOptions.staticLabels.labels = [20,30,40,50,60,70,80,90];
				localOptions.staticZones = [
				{strokeStyle: "#004478", min: 20, max: 40},
				{strokeStyle: "#2E78BC", min: 40, max: 60},
				{strokeStyle: "#88C5F7", min: 60, max: 90}
				]
			} else if (gauge.dataType === 'ABS_HUMIDITY') {
				minValue = 8;
				maxValue = 22;
				localOptions.staticLabels.labels = [8,10,12,14,16,18,20,22];
				localOptions.staticZones = [
				{strokeStyle: "#004478", min: 8,  max: 12},
				{strokeStyle: "#2E78BC", min: 12, max: 16},
				{strokeStyle: "#88C5F7", min: 16, max: 22}
				]
			}

			let g = new Gauge(document.getElementById("gauge" + i)).setOptions(localOptions);
			g.maxValue = maxValue;
			g.animationSpeed = 1;
			g.setMinValue(minValue);
			g.set(originalValue);

			this.gaugeObjects.push(g);

			document.getElementById("gaugeText" + i).innerText = String(roundedValue) + this.formatGaugeMeasureUnit(gauge.dataType);
		});

	}

	hasReports(): Boolean {
		return this.status.lastReports && Object.keys(this.status.lastReports).length > 0;
	}

	hasPumps(): Boolean {
		return this.status.lastPumps && Object.keys(this.status.lastPumps).length > 0;
	}

	hasBootups(): Boolean {
		return this.status.lastBootups && Object.keys(this.status.lastBootups).length > 0;
	}

}