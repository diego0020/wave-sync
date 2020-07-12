import { Injectable } from '@angular/core';
import { RoundService } from './round.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviousRoundsService {
  private activeRound: string;
  private histRef: firebase.database.Query;
  private historySubject = new ReplaySubject<any[]>(1);
  history$ = this.historySubject.asObservable();

  constructor(private roundService: RoundService) {
    this.roundService.round$.subscribe(
      currentRound => {
        if (currentRound.id !== this.activeRound) {
          this.activeRound = currentRound.id;
          this.histRef = firebase.database()
            .ref('rounds').orderByKey().limitToLast(6).endAt(this.activeRound);

          this.histRef.once('value', snap => {
            this.historySubject.next(
              this.procHistory(snap.val())
            );
          });
        }
      }
    );
  }

  private procHistory(rawHistory): any[] {
    return Object.keys(rawHistory)
      .filter(k => k !== this.activeRound)
      .map(k => {
        const round = rawHistory[k];
        return {
          clue: round.clue,
          score: round.score || 0,
          start: round.extremes.start,
          end: round.extremes.end
        };
      });
  }
}
