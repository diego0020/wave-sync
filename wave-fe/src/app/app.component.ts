import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';

const gameRef = 'games/IyN3LKwbM5SKrXzC5Lnz';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wave-fe';
  guess = 0;
  saving = false;
  guessSubj = new Subject<number>();

  ngOnInit() {
    console.log('init');
    const starCountRef = firebase.database().ref(gameRef + '/guess');
    starCountRef.on('value', (snapshot) => {
      this.guessSubj.next(snapshot.val() as number);
    });

    this.guessSubj.pipe(
      auditTime(300)
    ).subscribe(
      v => { this.guess = v; }
    );
  }

  moveNeedle(delta) {
    if (this.saving) {
      return;
    }
    console.log(delta);
    this.saving = true;
    const newGuess = Math.min(100, Math.max(0, this.guess + delta));
    firebase.database().ref(gameRef).update({
      guess: newGuess
    }, (error) => {
      if (error) {
        console.warn(error);
      }
      this.saving = false;
    });
  }
}
