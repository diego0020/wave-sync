import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, combineLatest } from 'rxjs';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { RoundService } from './round.service';
import { map } from 'rxjs/operators';

const PAST_TIME_DELTA = 60 * 60 * 1000; // one hour;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersSubject = new ReplaySubject(1);
  users$: Observable<any[]>;
  myUser$: Observable<any>;

  constructor(
    private authService: AuthService,
    roundService: RoundService
  ) {
    const usersRef = firebase.database().ref('users');
    authService.user$.subscribe(user => {
      const startTime = new Date().getTime() - PAST_TIME_DELTA;
      usersRef
        .orderByChild('lastSeen')
        .startAt(startTime)
        .on('value', (snap) => {
          this.usersSubject.next(snap.val());
        });
    });
    this.users$ = combineLatest(this.usersSubject, roundService.round$)
      .pipe(map(this.formatUsers));
    this.myUser$ = combineLatest(this.usersSubject, authService.user$)
      .pipe(
        map(this.formatOwnUser)
      );
  }
  formatUsers([users, round]) {
    const psychic = round.teller;
    return Object.keys(users).map(
      k => {
        const values = users[k];
        return {
          userName: values.displayName || k.substring(0, 8),
          psychic: k === psychic,
          online: values.lastSeen === 'online',
          id: k
        };
      }
    );
  }

  formatOwnUser([users, auth]) {
    const myUser = users[auth.uid];
    return {
      userName: (myUser && myUser.displayName) || auth.uid.substring(0, 8),
      id: auth.uid || '....'
    };
  }

  changeUserName(newUserName: string): Promise<any> {
    if (this.authService.userSnap) {
      const userPath = 'users/' + this.authService.userSnap.uid;
      return firebase.database().ref(userPath).update(
        { displayName: newUserName }
      );
    }
    return Promise.resolve(null);
  }
}
