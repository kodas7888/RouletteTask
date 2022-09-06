import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventlog',
  templateUrl: './eventlog.component.html',
  styleUrls: ['./eventlog.component.css']
})
export class EventlogComponent implements OnInit {
  @Input() events?: string[];

  displayedColumns: string[] = ['Event'];
  dataSource: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.dataSource = this.events as string[];
  }

  ngOnChanges(): void {
    this.dataSource = this.events as string[];
  }

}
