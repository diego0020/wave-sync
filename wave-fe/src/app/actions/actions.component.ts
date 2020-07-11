import { Component, OnInit } from '@angular/core';
import { RoundService } from '../round.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuessService } from '../guess.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styles: [
  ]
})
export class ActionsComponent implements OnInit {
  throttled = false;
  showSend$: Observable<boolean>;
  skipMessage$: Observable<string>;

  constructor(private roundService: RoundService, private guessService: GuessService) {
    this.showSend$ = this.roundService.round$.pipe(
      map(round => round.phase === 1 && !round.amTeller)
    );

    this.skipMessage$ = this.roundService.round$.pipe(
      map(round => {
        if (round.phase > 2) {
          return 'Become psychic';
        }
        if (round.phase > 0 || !round.amTeller) {
          return 'Skip Round and become psychic';
        }
        return null;
      })
    );
  }

  ngOnInit(): void {
  }

  reset() {
    this.roundService.startNewRound();
    this.throttle();
  }

  sendGuess() {
    this.guessService.sendFinalGuess();
    this.throttle();
  }

  private throttle() {
    this.throttled = true;
    window.setTimeout(() => { this.throttled = false; }, 1000);
  }

}
