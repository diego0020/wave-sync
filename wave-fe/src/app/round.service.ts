import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { bufferTime, filter, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoundService {
  private phaseSubj = new BehaviorSubject<number>(-1);
  private cluesSubj = new Subject<any>();
  private roundId = 'testRound';
  private roundAddr = `rounds/${this.roundId}`;
  private roundRef = firebase.database().ref(this.roundAddr);
  phase$ = this.phaseSubj.asObservable().pipe(
    distinctUntilChanged()
  );
  clues$ = this.cluesSubj.asObservable();

  constructor() {

    this.roundRef.on('value', (snapshot) => {
      const roundData = snapshot.val();
      this.phaseSubj.next(roundData.phase);
    });
  }

  resetRound() {
    const newRoundData = {
      phase: 0,
      guessingTeam: 'a',
      teller: 'uid',
      clue: '...',
      extremes: { end: '.', start: '.' }
    };
    this.roundRef.set(newRoundData,
      (error) => {
        if (error) {
          console.warn(error);
        }
      });
  }
}
