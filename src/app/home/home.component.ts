import { Component, OnInit } from '@angular/core';
import { SquareStat, Square } from '../shared/models'
import { HomeAPIService, Game, Configuration, Stats } from './home.api.service'
import { LogService } from '../shared/log.service'
import { timer, forkJoin, Subject, Subscription, of } from 'rxjs';
import { take, tap, switchMap, repeat, takeWhile, finalize, retry, takeLast } from 'rxjs/operators';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	private counter = 30;
	private offset = 0;
	private blinking = -1;
	private stop = new Subject<void>();
	private nextId = 0;
	private running?: Subscription;

	url = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1';
	squares?: Square[];
	stats?: SquareStat[];
	events: string[] = [''];
	log: string[] = [];
	isSpinning = false;

	constructor(private httpService: HomeAPIService, private logger: LogService) { }

	ngOnInit(): void {
		this.logger.log('Loading game board');

		this.setUrl(this.url);

		this.run();
	}

	run() {
		if (this.running) {
			this.running.unsubscribe();
		}

		this.running = of(1).pipe(
			switchMap(() => {
				return this.update();
			}),
			switchMap(() => {
				return this.sleep();
			}),
			repeat({ delay: () => this.stop }),
			retry({ delay: 1000 })
		).subscribe();
	}

	sleep() {
		return timer(0, 1000)
			.pipe(
				takeWhile(() => this.counter > 0),
				tap({
					next: () => this.tick(),
					complete: () => this.roll()
				})
			);
	}

	tick() {
		this.counter--;

		if (this.counter > this.offset) {
			this.setCurrentEventLog('Game ' + this.nextId + ' will start in ' + (this.counter - this.offset) + ' sec')
		}

		if (this.counter > 0 && this.counter <= this.offset && !this.isSpinning) {
			this.spin();
		}
	}

	roll() {
		this.getResult().subscribe(() => {
			timer(6000, 0).pipe(
				take(1),
				tap(() => this.blinking = -1)
			).subscribe();
		});
	}

	update() {
		let configuration = this.httpService.getConfiguration();
		let stats = this.httpService.getStats();
		let nextGame = this.httpService.getNextGame();

		return forkJoin([configuration, stats, nextGame]).pipe(
			tap(([a, b, c]) => {
				this.setupConfiguration(a);
				this.setupStats(b);
				this.setNextGame(c);
			}),
			retry({ delay: 1000 })
		);
	}

	spin() {
		if (!this.isSpinning) {
			this.logger.log('Spinning the wheel');

			this.isSpinning = true;
		}
	}

	getResult() {
		let game = this.httpService.getGame(this.nextId);

		return game.pipe(
			tap(x => {
				if (!x.result) {
					this.logger.log('Still no result, continue spinning');
					throw new Error();
				}
			}),
			tap(x => {
				this.setGame(x);
			}),
			retry({ delay: 1000 })
		);
	}

	getBlinking(value: number) {
		if (value == this.blinking) {
			return true;
		}

		return false;
	}

	setupConfiguration(configuration: Configuration) {
		this.squares = configuration.positionToId?.map((id) => {
			return <Square>{ value: configuration.results?.at(id), color: configuration.colors?.at(id) };
		});
	}

	setupStats(stats: Stats[]) {
		this.stats = stats?.map((r) => {
			return <SquareStat>{ square: this.squares?.find(s => s.value == r.result), count: r.count };
		});
	}

	setNextGame(game: Game) {
		this.logger.log('Checking for new game');

		if (game.fakeStartDelta > 0) {
			this.logger.log('sleeping for fakeStartDelta ' + game.fakeStartDelta + ' sec');
		} else {
			this.logger.log('Wheel is already spinning!');
		}

		this.counter = game.startDelta;
		this.nextId = game.id;
		this.offset = game.startDelta - game.fakeStartDelta;
	}

	setGame(game: Game) {
		this.logger.log('result is ' + game.result);
		this.pushEventLog('Game ' + game.id + ' ended, result is ' + game.result);

		this.blinking = game.result;

		this.isSpinning = false;
		this.stop.next();
	}

	setUrl(url: string) {
		this.httpService.setUrl(url);
		this.run();
	}

	pushEventLog(ev: string) {
		this.events[this.events.length - 1] = ev;
		this.events.push('');
		this.events = [...this.events];
	}

	setCurrentEventLog(ev: string) {
		this.events[this.events.length - 1] = ev;
		this.events = [...this.events];
	}
}