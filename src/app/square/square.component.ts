import { Component, OnInit, Input } from '@angular/core';
import { Square } from '../shared/models'

@Component({
	selector: 'app-square',
	templateUrl: './square.component.html',
	styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
	@Input() square?: Square;
	@Input() blink = false;

	constructor() { }

	ngOnInit(): void {
	}
}
