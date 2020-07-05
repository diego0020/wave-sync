import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { bufferTime, filter, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RoundService } from './round.service';




@Injectable({
  providedIn: 'root'
})
export class GuessService {
  private roundId: string;
  private optimisticGuess = 0;
  private trueValue = 0;
  private sentMsg = -1;
  private guessSubj = new BehaviorSubject<number>(10);
  private moveSubj = new Subject<number>();
  private guessAddr: string;
  private guessRef: firebase.database.Reference;

  guess$ = this.guessSubj.asObservable();
  constructor(private roundService: RoundService) {
    this.roundService.round$.subscribe(
      round => {
        if (round.id !== this.roundId) {
          this.roundId = round.id;
          if (this.guessRef) {
            this.guessRef.off();
          }
          this.guessAddr = `guesses/${this.roundId}`;
          this.guessRef = firebase.database().ref(this.guessAddr);
          this.guessRef.on('value', (snapshot) => {
            const guessData = snapshot.val();
            if (guessData) {
              this.trueValue = guessData.guess as number;
              if (this.trueValue !== this.sentMsg) {
                this.guessSubj.next(this.trueValue);
                this.optimisticGuess = this.trueValue;
              }
            }
          }
          );
        }
      }
    );


    this.moveSubj.pipe(
      tap(
        d => {
          this.optimisticGuess = this.clamp(this.optimisticGuess + d);
          this.guessSubj.next(this.optimisticGuess);
        }
      ),
      bufferTime(500),
      filter(a => a.length > 0))
      .subscribe((deltas: number[]) => {
        const newGuess = this.clamp(
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
    this.guessRef.update({
      guess: newGuess
    }, (error) => {
      if (error) {
        console.warn(error);
        this.optimisticGuess = this.trueValue;
        this.guessSubj.next(this.trueValue);
      }
    });
  }

  sendFinalGuess() {
    this.roundService.sendFinalGuess(this.optimisticGuess);
  }

  private clamp(n: number) {
    return Math.max(0, Math.min(
      100, n
    ));
  }

  get value() {
    return this.optimisticGuess;
  }
}
