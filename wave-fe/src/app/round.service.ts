import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AuthService } from './auth.service';
import { AllCards } from './data';
import { GuessService } from './guess.service';
import { randomItem } from './helpers';

interface RoundData {
  start: string;
  startColor: string;
  end: string;
  endColor: string;
  value: number;
}

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
  private score: any = null;
  private newRoundData: RoundData = null;

  private colors = [
    'blue',
    'green',
    'indigo',
    'orange',
    'purple',
    'red',
    'teal',
  ];

  round$ = this.roundSubject.asObservable();

  isGuestPlayer$ = this.round$.pipe(
    map(r => r.phase === 1 && !r.amTeller)
  );

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(
      user => {
        this.roundRef.on('value', (snapshot) => {
          const roundData = snapshot.val();
          this.roundSubject.next(
            this.procRoundData(roundData)
          );
        });
      }
    );
  }

  private generateRandData(): RoundData {
    const cardIndex = Math.floor(Math.random() * AllCards.length);
    const card = AllCards[cardIndex];
    return {
      value: Math.round(Math.random() * 100),
      start: card[0],
      startColor: randomItem(this.colors),
      end: card[1],
      endColor: randomItem(this.colors),
    };
  }

  resetRound() {
    const placeholderData = {
      phase: 0,
      guessingTeam: 'a',
      teller: this.auth.userSnap.uid,
      clue: '...',
      extremes: {
        end: '.',
        endColor: '',
        start: '.',
        startColor: ''
      },
      finalGuess: null,
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
        start: this.newRoundData.start,
        endColor: this.newRoundData.endColor,
        startColor: this.newRoundData.startColor,
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

  private procRoundData(rawData): RoundData {
    const roundData = { ...rawData };
    roundData.amTeller = roundData.teller === this.auth.userSnap.uid;
    roundData.trueValue = null;
    roundData.id = this.roundId;

    if (roundData.phase === 0 && roundData.amTeller && this.newRoundData === null) {
      this.newRoundData = this.generateRandData();
      roundData.trueValue = this.newRoundData.value;
      roundData.extremes = {
        start: this.newRoundData.start,
        startColor: this.newRoundData.startColor,
        end: this.newRoundData.end,
        endColor: this.newRoundData.endColor,
      };
    }
    if (roundData.phase === 4 && roundData.finalGuess) {
      if (this.score === null) {
        this.getScore(roundData);
      } else {
        roundData.score = this.score;
      }
    }
    if (roundData.phase === 1) {
      this.newRoundData = null;
      this.score = null;
    }

    return roundData;
  }

  sendGuess(finalGuess) {

    const updates = {
      [this.guessAddr + '/guess']: finalGuess,
      [this.roundAddr + '/phase']: 4,
      [this.roundAddr + '/finalGuess']: finalGuess,
    };

    firebase.database().ref().update(updates,
      (error) => {
        if (error) {
          console.warn(error);
        }
      });
  }

  private getScore(roundData) {
    const finalGuess = roundData.finalGuess;
    firebase.database().ref(this.privateAddr)
      .once('value', snap => {
        const data = snap.val();
        this.score = {
          score: this.calculateScore(finalGuess, data.truePosition),
          trueValue: data.truePosition,
          finalGuess
        };
        roundData.score = this.score;
        this.roundSubject.next(roundData);
      });
  }

  private calculateScore(a: number, b: number) {
    const diff = Math.abs(a - b);
    if (diff < 10) {
      return 10;
    } else if (diff < 20) {
      return 5;
    }
    return 0;
  }
}
