import { Component, OnInit, Input } from '@angular/core';
import { SquareStat } from '../shared/models'


export interface PeriodicElement {
	name: string;
	weight: number;
	symbol: string;
}

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
	@Input() results?: SquareStat[];

	displayedColumns: string[] = [];
	data: any[] = [];

	constructor() { }

	ngOnInit(): void {
	}

	ngOnChanges(): void {
		let array = [];
		array.push(this.makeData());
		array.push(this.makeCount());
		this.data = array;
		this.displayedColumns = Object.keys(array[0]);
	}

	makeData() {
		const results = this.results as SquareStat[];
		let output: { [k: string]: SquareStat } = {};

		for (let i = 0; i < results.length; ++i) {
			output[i.toString()] = results[i];
		}

		return output;
	}

	makeCount() {
		const results = this.results as SquareStat[];
		let output: { [k: string]: number } = {};

		for (let i = 0; i < results.length; ++i) {
			output[i.toString()] = results[i].count;
		}

		return output;
	}

	isCount(val: any): boolean {
		return typeof val === 'number';
	}

	isCold(index: number) {
		return index == 4;
	}

	isNeutral(index: number) {
		return index == 5;
	}

	isHot(index: number) {
		return index == (this.results as SquareStat[]).length - 5;
	}

	getSpan(index: number) {
		if (index == 4 || index == (this.results as SquareStat[]).length - 5) {
			return 5;
		} else if (index == 5) {
			return (this.results as SquareStat[]).length - 10;
		}
		else {
			return 0;
		}
	}
	getDisplay(index: number) {
		if (index == 4 || index == (this.results as SquareStat[]).length - 5) {
			return {};
		} else if (index == 5) {
			return {};
		}
		else {
			return { 'display': 'none' };
		}
	}

	getClass(index: number) {
		let classstr = ''
		if (index < 5) {
			classstr = 'cold';
		} else if (index >= 5 && index < (this.results as SquareStat[]).length - 5) {
			classstr = 'neutral';
		} else if (index >= (this.results as SquareStat[]).length - 5) {
			classstr = 'hot';
		}


		return classstr;
	}
}