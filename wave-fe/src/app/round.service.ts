import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { auditTime, bufferTime, filter, tap, debounceTime } from 'rxjs/operators';

const roundRef = 'rounds/testRound';


@Injectable({
  providedIn: 'root'
})
export class RoundService {
  private optimisticGuess = 0;
  private trueValue = 0;
  private sentMsg = -1;
  private guessSubj = new BehaviorSubject<number>(10);
  private moveSubj = new Subject<number>();
  guess$ = this.guessSubj.asObservable();

  constructor() {
    const starCountRef = firebase.database().ref(roundRef + '/guess');
    starCountRef.on('value', (snapshot) => {
      this.trueValue = snapshot.val() as number;
      if (this.trueValue !== this.sentMsg) {
        this.guessSubj.next(this.trueValue);
        this.optimisticGuess = this.trueValue;
      }
    });

    this.moveSubj.pipe(
      tap(
        d => {
          this.optimisticGuess = this.wrap(this.optimisticGuess + d);
          this.guessSubj.next(this.optimisticGuess);
        }
      ),
      bufferTime(500),
      filter(a => a.length > 0))
      .subscribe((deltas: number[]) => {
        const newGuess = this.wrap(
          deltas.reduce((acc, curr) => acc + curr, this.trueValue)
        );
        this.sendGuess(newGuess);
      });

    // Failsafe: after 1 sec of inactivity write the value from db
    this.moveSubj.pipe(
      debounceTime(1000)
    ).subscribe(() => {
      this.optimisticGuess = this.trueValue;
      this.guessSubj.next(this.trueValue);
    });
  }

  moveNeedle(delta: number) {
    this.moveSubj.next(delta);
  }

  private sendGuess(newGuess: number) {
    this.sentMsg = newGuess;
    this.optimisticGuess = newGuess;
    this.guessSubj.next(this.optimisticGuess);
    firebase.database().ref(roundRef).update({
      guess: newGuess
    }, (error) => {
      if (error) {
        console.warn(error);
        this.optimisticGuess = this.trueValue;
        this.guessSubj.next(this.trueValue);
      }
    });
  }

  private wrap(n: number) {
    return Math.max(0, Math.min(
      100, n
    ));
  }
}
