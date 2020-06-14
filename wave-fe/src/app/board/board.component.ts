import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GuessService } from '../guess.service';
import { RoundService } from '../round.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  guess$: Observable<number>;
  rotation$: Observable<number>;
  trueValueRotation$: Observable<number>;
  clues$: Observable<any>;
  showGuessButtons$: Observable<boolean>;
  showClueInput$: Observable<boolean>;
  clueInput = '';
  sendingData = false;

  constructor(private guessServ: GuessService, private roundServ: RoundService) {
    this.guess$ = guessServ.guess$;
    this.rotation$ = this.guess$.pipe(
      map(n => 0.5 + (n / 200))
    );

    this.trueValueRotation$ = roundServ.round$.pipe(
      map(r => r !== null ? 0.5 + (r.trueValue / 200) : null)
    );

    this.clues$ = roundServ.round$.pipe(
      tap(() => this.sendingData = false),
      map(r => ({
        start: r.extremes.start,
        end: r.extremes.end,
        target: r.clue
      })),
    );

    this.showGuessButtons$ = roundServ.round$.pipe(
      map(r => r.phase === 1 && !r.amTeller)
    );

    this.showClueInput$ = roundServ.round$.pipe(
      map(r => r.phase === 0 && r.amTeller)
    );
  }

  ngOnInit(): void {
  }

  moveNeedle(delta: number) {
    this.guessServ.moveNeedle(delta);
  }

  sendClue() {
    this.roundServ.sendClue(this.clueInput);
    this.clueInput = '';
    this.sendingData = true;
  }

}
