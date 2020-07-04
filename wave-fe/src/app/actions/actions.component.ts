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
  disableSend$: Observable<boolean>;

  constructor(private roundService: RoundService, private guessService: GuessService) {
    this.disableSend$ = this.roundService.round$.pipe(
      map(round => (round.phase !== 1) || round.amTeller)
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
