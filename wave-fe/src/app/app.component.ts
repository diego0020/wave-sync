import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Subject } from 'rxjs';
import { auditTime, bufferTime, filter, tap } from 'rxjs/operators';

const gameRef = 'games/IyN3LKwbM5SKrXzC5Lnz';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'wave-fe';
  guess = 0;
  optimisticGuess = 0;
  sentMsg = -1;
  guessSubj = new Subject<number>();
  moveSubj = new Subject<number>();

  ngOnInit() {
    const starCountRef = firebase.database().ref(gameRef + '/guess');
    starCountRef.on('value', (snapshot) => {
      this.guessSubj.next(snapshot.val() as number);
    });

    this.guessSubj.pipe(
      auditTime(300)
    ).subscribe(
      v => {
        this.guess = v;
        if (this.sentMsg !== v) {
          this.optimisticGuess = this.guess;
        }
        this.sentMsg = -1;
      }
    );

    this.moveSubj.pipe(
      tap(
        d => {
          this.optimisticGuess = Math.max(0, Math.min(100,
            this.optimisticGuess + d
          ));
        }
      ),
      bufferTime(300),
      filter(a => a.length > 0))
      .subscribe((deltas: number[]) => {
        const newGuess = Math.max(0, Math.min(100,
          deltas.reduce((acc, curr) => acc + curr, this.guess)
        ));
        console.log(newGuess, 'newGuess');
        console.log(this.optimisticGuess, 'opti');
        this.sendGuess(newGuess);
      });
  }

  moveNeedle(delta: number) {
    this.moveSubj.next(delta);
  }

  sendGuess(newGuess: number) {
    this.sentMsg = newGuess;
    const rollBack = this.guess;
    this.guess = newGuess;
    firebase.database().ref(gameRef).update({
      guess: newGuess
    }, (error) => {
      if (error) {
        console.warn(error);
        this.guess = rollBack;
        this.optimisticGuess = this.guess;
      }
    });
  }

}
