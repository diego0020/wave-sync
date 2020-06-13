import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { RoundService } from './round.service';
import { auditTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Wave Sync';
  userId = null;

  constructor(private round: RoundService) {
  }

  ngOnInit() {

    firebase.auth().signInAnonymously().catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
      } else {
        this.userId = null;
      }
    });

  }
}
