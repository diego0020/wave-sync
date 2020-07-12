import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
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
  showHistory = false;
  tempUserName: string;
  loading = false;

  constructor(
    previousRondService: PreviousRoundsService,
    private usersService: UsersService
  ) {
    this.userId$ = usersService.myUser$;
    this.history$ = previousRondService.history$;
    this.users$ = usersService.users$;
    this.userId$.subscribe(u => {
      this.tempUserName = u.userName;
    });
  }

  ngOnInit(): void {
  }

  getUserKey(u: any) {
    return u.id;
  }

  toggleChangeUserName() {
    this.showChangeUser = !this.showChangeUser;
  }

  changeUserName() {
    const newUserName = this.tempUserName;
    this.loading = true;
    this.usersService.changeUserName(newUserName).then(
      () => {
        this.loading = false;
        this.showChangeUser = false;
      }
    );
  }

  toggleShowHistory() {
    this.showHistory = !this.showHistory;
  }

}
