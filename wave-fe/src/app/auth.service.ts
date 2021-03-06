import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubj = new ReplaySubject<any>();
  user$ = this.userSubj.asObservable();
  private currUser = null;

  constructor() {
    const auth = firebase.auth();
    auth.signInAnonymously().catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });

    auth.onAuthStateChanged(user => {
      const connRef = firebase.database().ref('.info/connected');
      const userRef = firebase.database().ref('users/' + user.uid);
      connRef.on('value', (snap) => {
        userRef.onDisconnect().update(
          { lastSeen: firebase.database.ServerValue.TIMESTAMP }
        );
        userRef.update({
          lastSeen: 'online'
        });
        if (snap.val()) {
          this.currUser = user;
          this.userSubj.next(user);
        }
      });
    });

  }
  get userSnap() {
    return { uid: this.currUser.uid };
  }

}
