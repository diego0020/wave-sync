import { Component, OnInit } from '@angular/core';
import { RoundService } from '../round.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styles: [
  ]
})
export class ActionsComponent implements OnInit {

  constructor(private round: RoundService) { }

  ngOnInit(): void {
  }

  reset() {
    this.round.resetRound();
  }

}
