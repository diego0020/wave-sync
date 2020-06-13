import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RoundService } from '../round.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  guess$: Observable<number>;
  rotation$: Observable<number>;

  constructor(private round: RoundService) {
    this.guess$ = round.guess$;
    this.rotation$ = this.guess$.pipe(
      map(n => 0.5 + (n / 200))
    );
  }

  ngOnInit(): void {
  }

  moveNeedle(delta: number) {
    this.round.moveNeedle(delta);
  }

}
