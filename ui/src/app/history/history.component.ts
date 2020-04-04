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
	timer: any;
	lastGeneratedTimestamp: any = null;

	constructor(private dataService: DataService) { }

	getChartDataSetByChartName(chartName): any {
		return this.chart.data.datasets.filter(function(dataset, i, ar) {
			return dataset.label === chartName;
		});
	}

	preprocessPoints(historyData: Array<any>): Array<any> {
		return historyData.map(function (p) {
			p.x = new Date(p.x);
			return p;
		});
	}

	updateHistory() {
		this.dataService.getHistorySince(this.lastGeneratedTimestamp == null ? '' : this.lastGeneratedTimestamp).subscribe(
			historiesSince => {
				historiesSince.forEach( (historySince, index, a) => {
					if (historySince.data.length > 0) {
						historySince.data = this.preprocessPoints(historySince.data);
						if (historySince.reportDataType === 'PUMP') {
							historySince.data = this.preprocessPumpData(historySince.data);
						}

						var dataset = this.getChartDataSetByChartName(historySince.chartName);

						dataset[0].data.unshift(...historySince.data);
						//todo: probably remove all of the data checking timestamps instead of simple count
					}
				});

				this.lastGeneratedTimestamp = historiesSince.length > 0 ? historiesSince[0].generatedTimestamp : null;

				let squashedData = [];
				this.chart.data.datasets.forEach( (dataset, index, a) => {
					squashedData.push(...dataset.data);
				});
				squashedData.sort((a,b) => b.x.getTime() - a.x.getTime());

				this.chart.options.scales.xAxes[0].ticks.max = squashedData.length > 0 ?
				squashedData[0].x : this.chart.options.scales.xAxes[0].ticks.max
				this.chart.update();
			});
	}

	ngOnInit() {
		this.dataService.getHistory().subscribe(
			histories => {
				histories.sort((a,b) => (a.reportDataType == 'PUMP') ? 1 : -1);

				this.chart = this.createChart(histories);

				this.populateChart(this.chart, histories);

				this.lastGeneratedTimestamp = histories.length > 0 ? histories[0].generatedTimestamp : null;

				this.chart.update();
			}
			);
		this.timer = setInterval(() => {
			this.updateHistory();
		}, 60000);
	}

	ngOnDestroy() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	preprocessPumpData(sourceData: Array<any>): Array<any> {
		var newData = [];
		sourceData.forEach(p => {
			newData.push(p);
			if (p.y === 1) {
				var newP = Object.assign({}, p);
				newP.x = new Date(newP.x.getTime() - 1);
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
		("0" + (d.getMonth() + 1)).slice(-2) + " " +
		("0" + d.getHours()).slice(-2) + ":" +
		("0" + d.getMinutes()).slice(-2) + ":" +
		("0" + d.getSeconds()).slice(-2);
	}

	createChart(histories: Array<History>): any {
		var latestTimestamp = this.findLatestTimestamp(histories);
		var earliestTimestamp = this.findEarliestTimestamp(histories);

		return new Chart(document.getElementById("lineChart"), {
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
							userCallback: (label, index, labels) => {
								return this.formatDateTimeWithSeconds(new Date(label));
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
	}

	populateChart(chart: any, histories: Array<History>) {
		histories.forEach( (history, index, a) => {
			history.data = this.preprocessPoints(history.data);

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

			chart.data.datasets.push({
				label: history.chartName,
				yAxisID: yAxisIdMap,
				lineTension: lineTensionMap,
				pointRadius: 1,
				fill: false,
				showLine: true,
				backgroundColor: history.color,
				borderColor: history.color,
				data: history.data
			});
		})
	}

	findLatestTimestamp(histories: History[]): any {
		return Math.max.apply(Math,
			histories
			.filter(function(o, i, ar) {
				return o.data.length > 0;
			})
			.map(function(o) {
				return o.data[0].x;
			}));
	}

	findEarliestTimestamp(histories: History[]): any {
		return Math.min.apply(Math,
			histories
			.filter(function(o, i, ar) {
				return o.data.length > 0;
			})
			.map(function(o) {
				return o.data[o.data.length - 1].x;
			}));
	}
}
