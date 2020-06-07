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
        this.optimisticGuess = this.guess;
      }
    );

    this.moveSubj.pipe(
      tap(
        d => { this.optimisticGuess = Math.max(0, Math.min(100, this.guess + d)); }
      ),
      bufferTime(500),
      filter(a => a.length > 0))
      .subscribe((deltas: number[]) => {
        const newGuess = Math.max(0, Math.min(100,
          deltas.reduce((acc, curr) => acc + curr, this.guess)
        ));
        if (newGuess !== this.guess) {
          this.sendGuess(newGuess);
        } else {
          this.optimisticGuess = this.guess;
        }
      });
  }

  moveNeedle(delta) {
    this.moveSubj.next(delta);
  }

  sendGuess(newGuess) {
    firebase.database().ref(gameRef).update({
      guess: newGuess
    }, (error) => {
      if (error) {
        console.warn(error);
      }
    });
  }

}
