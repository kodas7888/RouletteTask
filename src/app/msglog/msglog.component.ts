import { Component, OnInit } from '@angular/core';
import { LogService } from '../shared/log.service'

@Component({
  selector: 'app-msglog',
  templateUrl: './msglog.component.html',
  styleUrls: ['./msglog.component.css']
})
export class MsglogComponent implements OnInit {
  msglist: string[] = [];

  constructor(private logger: LogService) { }

  ngOnInit(): void {
    this.logger.logList.subscribe((mlist) => {
      this.msglist = mlist;
    });
  }

}
