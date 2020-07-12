import { Component, OnInit } from '@angular/core';
import { RoundService } from '../round.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuessService } from '../guess.service';

const SEND_TIMEOUT = 5; // seconds

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
  sendingFinalGuess = false;
  sendingSkipRound = false;
  sendTimeout = 0;
  startSendTimeout = 0;
  skipTimeout = 0;
  startSkipTimeout = 0;


  constructor(private roundService: RoundService, private guessService: GuessService) {
    this.showSend$ = this.roundService.round$.pipe(
      map(round => round.phase === 1 && !round.amTeller)
    );

    this.skipMessage$ = this.roundService.round$.pipe(
      map(round => {
        if (round.phase > 3) {
          return 'Start next round and become psychic';
        }
        if ((!round.amTeller && round.phase === 0)
          || (round.amTeller && round.phase > 0)
        ) {
          return 'Skip Round and become psychic';
        }
        return null;
      })
    );
  }

  ngOnInit(): void {
  }

  toggleSkipRound() {
    this.sendingSkipRound = !this.sendingSkipRound;
    if (this.sendingSkipRound) {
      this.skipTimeout = 5;
      this.startSkipTimeout = new Date().getTime();
      window.setTimeout(this.decreaseSkipTimeout, 100);
    }
  }

  decreaseSkipTimeout = () => {
    const currTs = new Date().getTime();
    const delta = SEND_TIMEOUT - ((currTs - this.startSkipTimeout) / 1000);
    this.skipTimeout = Math.ceil(delta);
    if (delta > 0) {
      window.setTimeout(this.decreaseSkipTimeout, 100);
    }
  }

  doSkipRound() {
    this.throttle();
    this.toggleSkipRound();
    this.roundService.startNewRound();
  }

  toggleSendGuess() {
    this.sendingFinalGuess = !this.sendingFinalGuess;
    if (this.sendingFinalGuess) {
      this.sendTimeout = 5;
      this.startSendTimeout = new Date().getTime();
      window.setTimeout(this.decreaseSendTimeout, 100);
    }
  }

  decreaseSendTimeout = () => {
    const currTs = new Date().getTime();
    const delta = SEND_TIMEOUT - ((currTs - this.startSendTimeout) / 1000);
    this.sendTimeout = Math.ceil(delta);
    if (delta > 0) {
      window.setTimeout(this.decreaseSendTimeout, 100);
    }
  }

  doSendGuess() {
    this.throttle();
    this.toggleSendGuess();
    this.guessService.sendFinalGuess();
  }

  private throttle() {
    this.throttled = true;
    window.setTimeout(() => { this.throttled = false; }, 1000);
  }

}
