import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogService } from '../shared/log.service'
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HomeAPIService {
    private url = '';

    constructor(private http: HttpClient, private logger: LogService) { }

    getConfiguration() {
        return this.http.get<Configuration>(this.url + '/configuration').pipe(
            tap(() => this.logger.log('GET .../configuration'))
        );
    }

    getStats() {
        return this.http.get<Stats[]>(this.url + '/stats?limit=200').pipe(
            tap(() => this.logger.log('GET .../stats?limit=200'))
        );
    }

    getGame(id: number) {
        return this.http.get<Game>(this.url + '/game/' + id).pipe(
            tap(() => this.logger.log('GET .../game/' + id))
        );
    }

    getNextGame() {
        return this.http.get<Game>(this.url + '/nextGame').pipe(
            tap(() => this.logger.log('GET .../nextGame'))
        );
    }

    setUrl(url: string) {
        this.url = url;
    }
}

export interface Configuration {
    name: string;
    slots: number;
    results: number[];
    colors: string[];
    positionToId: number[];
}

export interface Stats {
    result: number;
    count: number;
}

export interface Game {
    uuid: string,
    id: number,
    startTime: Date,
    startDelta: number,
    startDeltaUs: number,
    fakeStartDelta: number,
    duration: number,
    result: number,
    outcome: number
}