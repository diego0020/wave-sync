import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AuthService } from './auth.service';
import { AllCards } from './data';

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
  private newRoundData: any = null;

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
    const placeholderData = {
      phase: 0,
      guessingTeam: 'a',
      teller: this.auth.userSnap.uid,
      clue: '...',
      extremes: { end: '.', start: '.' }
    };
    const resetGuess = {
      guess: 0
    };

    this.newRoundData = null;

    const updates = {
      [this.roundAddr]: placeholderData,
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
      extremes: {
        end: this.newRoundData.end,
        start: this.newRoundData.start
      }
    };

    const privateData = {
      teller: this.auth.userSnap.uid,
      truePosition: this.newRoundData.value
    };

    const updates = {
      [this.roundAddr]: newRoundData,
      [this.privateAddr]: privateData
    };

    firebase.database().ref().update(updates,
      (error) => {
        if (error) {
          console.warn(error);
        }
        this.newRoundData = null;
      });
  }

  private procRoundData(rawData) {
    const roundData = { ...rawData };
    roundData.amTeller = roundData.teller === this.auth.userSnap.uid;
    roundData.trueValue = null;

    if (roundData.phase === 0 && roundData.amTeller && this.newRoundData === null) {
      this.newRoundData = this.generateRandData();
      roundData.trueValue = this.newRoundData.value;
      roundData.extremes = {
        start: this.newRoundData.start,
        end: this.newRoundData.end
      };
    }
    return roundData;
  }

  private generateRandData() {
    const cardIndex = Math.floor(Math.random() * AllCards.length);
    const card = AllCards[cardIndex];
    return {
      value: Math.round(Math.random() * 100),
      start: card[0],
      end: card[1],
    };
  }
}
