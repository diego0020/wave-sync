import { Component, OnInit, Input } from '@angular/core';
import { RoundService } from '../round.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';
import { PreviousRoundsService } from '../previous-rounds.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styles: [
  ]
})
export class GameInfoComponent implements OnInit {
  userId$: Observable<any>;
  round$: Observable<any>;
  history$: Observable<any[]>;

  constructor(private roundService: RoundService, auth: AuthService, private previousRondService: PreviousRoundsService) {
    this.round$ = this.roundService.round$;
    this.userId$ = auth.user$.pipe(
      map(u => u && u.uid)
    );
    this.history$ = previousRondService.history$;
  }

  ngOnInit(): void {
  }

}
