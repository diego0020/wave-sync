import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { bufferTime, filter, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoundService {
  private roundId = 'testRound';
  private roundAddr = `rounds/${this.roundId}`;
  private guessAddr = `guesses/${this.roundId}`;
  private privateAddr = `roundsPrivate/${this.roundId}`;
  private roundRef = firebase.database().ref(this.roundAddr);
  private roundSubject = new ReplaySubject<any>(1);
  private trueValue: number | null = null;

  round$ = this.roundSubject.asObservable();

  constructor(private auth: AuthService) {

    this.roundRef.on('value', (snapshot) => {
      const roundData = snapshot.val();
      this.roundSubject.next(
        this.procRoundData(roundData)
      );
    });
  }

  resetRound() {
    const newRoundData = {
      phase: 0,
      guessingTeam: 'a',
      teller: this.auth.userSnap.uid,
      clue: '...',
      extremes: { end: '.', start: '.' }
    };
    const resetGuess = {
      guess: 0
    };

    const updates = {
      [this.roundAddr]: newRoundData,
      [this.guessAddr]: resetGuess
    };

    firebase.database().ref().update(updates,
      (error) => {
        if (error) {
          console.warn(error);
        }
      });
  }

  sendClue(clue: string) {
    const newRoundData = {
      phase: 1,
      guessingTeam: 'a',
      teller: this.auth.userSnap.uid,
      clue,
      extremes: { end: 'Easy', start: 'Hard' }
    };

    const privateData = {
      teller: this.auth.userSnap.uid,
      truePosition: this.trueValue
    };

    const updates = {
      [this.roundAddr]: newRoundData,
      [this.privateAddr]: privateData
    };

    console.log(updates);

    firebase.database().ref().update(updates,
      (error) => {
        if (error) {
          console.warn(error);
        }
      });
  }

  private procRoundData(rawData) {
    const roundData = { ...rawData };
    roundData.amTeller = roundData.teller === this.auth.userSnap.uid;
    roundData.trueValue = null;

    if (roundData.phase === 0 && roundData.amTeller && this.trueValue === null) {
      this.trueValue = Math.round(Math.random() * 100);
      roundData.trueValue = this.trueValue;
    }
    return roundData;
  }
}
