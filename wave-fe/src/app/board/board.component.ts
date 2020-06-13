import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RoundService } from '../round.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  guess$: Observable<number>;

  constructor(private round: RoundService) {
    this.guess$ = round.guess$;
  }

  ngOnInit(): void {
  }

  moveNeedle(delta: number) {
    this.round.moveNeedle(delta);
  }

}
