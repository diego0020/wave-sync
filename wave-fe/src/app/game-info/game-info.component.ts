import { Component, OnInit, Input } from '@angular/core';
import { RoundService } from '../round.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';
import { PreviousRoundsService } from '../previous-rounds.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styles: [
  ]
})
export class GameInfoComponent implements OnInit {
  userId$: Observable<any>;
  users$: Observable<any>;
  history$: Observable<any[]>;
  showChangeUser = false;
  showHistory = true;

  constructor(
    previousRondService: PreviousRoundsService,
    private usersService: UsersService
  ) {
    this.userId$ = usersService.myUser$;
    this.history$ = previousRondService.history$;
    this.users$ = usersService.users$;
  }

  ngOnInit(): void {
  }

  getUserKey(u) {
    return u.id;
  }

  changeUserName(newUserName: string) {
    this.usersService.changeUserName(newUserName);
  }

}
