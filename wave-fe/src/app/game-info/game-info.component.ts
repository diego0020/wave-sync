import { Component, OnInit, Input } from '@angular/core';
import { RoundService } from '../round.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styles: [
  ]
})
export class GameInfoComponent implements OnInit {
  userId$: Observable<any>;
  phase$: Observable<number>;

  constructor(private round: RoundService, auth: AuthService) {
    this.phase$ = this.round.phase$;
    this.userId$ = auth.user$.pipe(
      map(u => u && u.uid)
    );
  }

  ngOnInit(): void {
  }

}
