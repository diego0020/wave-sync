import { Component, OnInit } from '@angular/core';
import { RoundService } from '../round.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styles: [
  ]
})
export class ActionsComponent implements OnInit {
  throttled = false;
  disableSend$: Observable<boolean>;

  constructor(private roundService: RoundService) {
    this.disableSend$ = this.roundService.round$.pipe(
      map(round => (round.phase !== 1) || round.amTeller)
    );
  }

  ngOnInit(): void {
  }

  reset() {
    this.roundService.resetRound();
    this.throttle();
  }

  sendGuess() {
    this.roundService.sendGuess();
    this.throttle();
  }

  private throttle() {
    this.throttled = true;
    window.setTimeout(() => { this.throttled = false; }, 1000);
  }

}
