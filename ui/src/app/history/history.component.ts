import {Component, OnInit} from "@angular/core";
import {DataService} from "../data.service";
import {History} from "../model/history";
import {Chart} from "chart.js";

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

	chart: any;

	histories: History[];

	constructor(private dataService: DataService) { }

	ngOnInit() {
		this.dataService.getHistory().subscribe(
			data => {
				this.histories = data;
				this.histories.sort((a,b) => (a.reportDataType == 'PUMP') ? 1 : -1);


				var latestTimestamp = Math.max.apply(Math, this.histories.filter(function(o, i, ar) { return o.data.length > 0; }).map(function(o) { return o.data[0].x; }))
				var earliestTimestamp = Math.min.apply(Math, this.histories.filter(function(o, i, ar) { return o.data.length > 0; }).map(function(o) { return o.data[o.data.length - 1].x; }))

				this.chart = new Chart(document.getElementById("lineChart"), {
					type: 'scatter',
					options: {
						responsive:false,
						maintainAspectRatio: false,
						legend: {
							position: 'bottom'
						},
						scales: {
							yAxes: [{
								id: 'temperature',
								type: 'linear',
								position: 'right',
							}, {
								id: 'humidity',
								type: 'linear',
								position: 'left',
							}, {
								id: 'abshumidity',
								type: 'linear',
								position: 'left',
							}, {
								id: 'pump',
								type: 'linear',
								position: 'right',
								ticks: {
									display: false,
									max: 1
								},
								display: false
							}],
							xAxes: [{
								ticks: {
									min: earliestTimestamp,
									max: latestTimestamp,
									userCallback: function(label, index, labels) {
										var d = new Date(label);
										return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) +
											" " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
									}
								}
							}]
						},
						tooltips: {
							callbacks: {
								label: (tooltipItem, data) => { return this.formatTooltipLabel(tooltipItem); }
							}
						}
					}
				});


				var colors = ['#77a1e5', '#8bbc21', '#f28f43', '#a6d0ff', '#ffaeae'];

				this.histories.forEach( (history, index, a) => {

					var yAxisIdMap;
					var lineTensionMap = 0.4;
					switch (history.reportDataType) {
						case 'AIR_TEMP':
							yAxisIdMap = 'temperature';
							break;
						case 'WATER_TEMP':
							yAxisIdMap = 'temperature';
							break;
						case 'HUMIDITY':
							yAxisIdMap = 'humidity';
							break;
						case 'ABS_HUMIDITY':
							yAxisIdMap = 'abshumidity';
							break;
						case 'PUMP':
							history.data = this.preprocessPumpData(history.data);
							lineTensionMap = 0;
							yAxisIdMap = 'pump';
							break;
					}

					history.data = history.data.map(function (p) {
						p.x = new Date(p.x);
						return p;
					});


					this.chart.data.datasets.push({
						label: history.chartName,
						yAxisID: yAxisIdMap,
						lineTension: lineTensionMap,
						pointRadius: 1,
						fill: false,
						showLine: true,
						backgroundColor: colors[index],
						borderColor: colors[index],
						data: history.data
					});
				})
				this.chart.update();
			}
			);
	}

	preprocessPumpData(sourceData: Array<any>): Array<any> {
		var newData = [];
		sourceData.forEach(p => {
			newData.push(p);
			if (p.y === 1) {
				var newP = Object.assign({}, p);
				newP.x -= 1;
				newP.y = 0;
				newData.push(newP);
			}
		});
		return newData;
	}

	formatTooltipLabel(tooltipItem): string {
		return tooltipItem.yLabel + ": " + this.formatDateTimeWithSeconds(new Date(tooltipItem.xLabel));
	}

	formatDateTimeWithSeconds(d: Date): string {
		return ("0" + d.getDate()).slice(-2) + "-" +
			   ("0" + (d.getMonth() + 1)).slice(-2) + "-"
			   + d.getFullYear() + " " +
			   ("0" + d.getHours()).slice(-2) + ":" +
			   ("0" + d.getMinutes()).slice(-2) + ":" +
			   ("0" + d.getSeconds()).slice(-2);
	}
}
