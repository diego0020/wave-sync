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
  score$: Observable<any>;
  message$: Observable<string>;
  showGuessButtons$: Observable<boolean>;
  showClueInput$: Observable<boolean>;
  clueInput = '';
  sendingData = false;
  firstFanRegionClip: any;
  secondFanRegionClip: any;
  thirdFanRegionClip: any;

  constructor(private guessService: GuessService, private roundService: RoundService) {
    this.thirdFanRegionClip = this.getClipPath(4);
    this.secondFanRegionClip = this.getClipPath(12);
    this.firstFanRegionClip = this.getClipPath(20);
    this.guess$ = guessService.guess$;
    this.rotation$ = this.guess$.pipe(
      map(n => 0.5 + (n / 200))
    );

    this.trueValueRotation$ = roundService.round$.pipe(
      map(r => {
        if (r.phase === 0 && r.amTeller) {
          return 0.5 + (r.trueValue / 200);
        }
        if (r.phase === 4 && r.score !== undefined) {
          return 0.5 + (r.trueValue / 200);
        }
        return null;
      })
    );

    this.message$ = roundService.round$.pipe(
      map(r => {
        if (r.phase === 0 && !r.amTeller) {
          return 'Waiting for clue';
        }
        if (r.phase === 1 && r.amTeller) {
          return 'Players are guessing';
        }
        return null;
      })
    );

    this.clues$ = roundService.round$.pipe(
      map(r => ({
        startColor: r.extremes.startColor,
        start: r.extremes.start,
        end: r.extremes.end,
        endColor: r.extremes.endColor,
        target: r.clue
      })),
    );

    this.showGuessButtons$ = roundService.round$.pipe(
      map(r => r.phase === 1 && !r.amTeller)
    );

    this.showClueInput$ = roundService.round$.pipe(
      map(r => r.phase === 0 && r.amTeller)
    );

    this.score$ = this.roundService.round$.pipe(
      map(
        r => r.score !== undefined ? { value: r.score } : null
      ));
  }

  ngOnInit(): void {
  }

  moveNeedle(delta: number) {
    this.guessService.moveNeedle(delta);
  }

  sendClue($event) {
    $event.preventDefault();
    this.roundService.sendClue(this.clueInput);
    this.clueInput = '';
    this.sendingData = true;
    window.setTimeout(() => { this.sendingData = false; }, 1000);
  }

  private getClipPath(perc: number) {
    const radAngle = perc * Math.PI / 100;
    const halfAngle = radAngle / 2;
    const delta = Math.tan(halfAngle) * 100;
    const top = 50 + delta;
    const bottom = 50 - delta;
    return {
      'clip-path': `polygon(50% 50%, 100% ${bottom}%, 100% ${top}%)`
    };
  }
}
