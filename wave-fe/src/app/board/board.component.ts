import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuessService } from '../guess.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  guess$: Observable<number>;
  rotation$: Observable<number>;

  constructor(private guessServ: GuessService) {
    this.guess$ = guessServ.guess$;
    this.rotation$ = this.guess$.pipe(
      map(n => 0.5 + (n / 200))
    );
  }

  ngOnInit(): void {
  }

  moveNeedle(delta: number) {
    this.guessServ.moveNeedle(delta);
  }

}
