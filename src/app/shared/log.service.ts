import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    logList = new BehaviorSubject<string[]>([]);

    log(msg: string, date?: Date) {
        let logMsg = '';

        if (date) {
            logMsg = date + " " + msg;
        } else {
            logMsg = new Date().toISOString() + " " + msg;
        }

        this.logList.next([...this.logList.getValue(), logMsg]);
    }
}