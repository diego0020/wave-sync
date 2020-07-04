import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AuthService } from './auth.service';
import { AllCards } from './data';
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

        const lastRoundsRef = firebase.database()
          .ref('rounds').orderByKey().limitToLast(1).endAt('testRounc');

        lastRoundsRef.on('child_added', snap => {
          // new round started
          const v = snap.val();
          const k = snap.key;
          this.roundId = k;
          this.roundAddr = `rounds/${this.roundId}`;
          this.guessAddr = `guesses/${this.roundId}`;
          this.privateAddr = `roundsPrivate/${this.roundId}`;
          if (this.roundRef) {
            this.roundRef.off();
          }
          this.roundRef = firebase.database().ref(this.roundAddr);
          this.roundRef.on('value', (snapshot) => {
            const roundData = snapshot.val();
            this.procRoundData(roundData);
          });
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

  startNewRound() {
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


    const newRoundRef = firebase.database()
      .ref('rounds').push();

    const newRoundId = newRoundRef.key;

    const newRoundAddr = `rounds/${newRoundId}`;
    const newGuessAdrr = `guesses/${newRoundId}`;

    const updates = {
      [newRoundAddr]: placeholderData,
      [newGuessAdrr]: resetGuess
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
      this.roundSubject.next(roundData);
      return;
    }
    if (roundData.phase === 4 && roundData.finalGuess) {
      if (this.score === null) {
        this.score = {};
        this.fetchScore(roundData).then(
          roundDataWithScore => this.roundSubject.next(roundDataWithScore)
        );
        return;
      } else {
        roundData.score = this.score;
        this.roundSubject.next(roundData);
        return;
      }
    }
    if (roundData.phase === 1) {
      this.newRoundData = null;
      this.score = null;
    }
    this.roundSubject.next(roundData);
  }

  sendFinalGuess(finalGuess) {

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

  private fetchScore(roundData) {
    const finalGuess = roundData.finalGuess;
    return firebase.database().ref(this.privateAddr)
      .once('value').then(snap => {
        const data = snap.val();
        this.score = {
          score: this.calculateScore(finalGuess, data.truePosition),
          trueValue: data.truePosition,
          finalGuess
        };
        roundData.score = this.score;
        return roundData;
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
