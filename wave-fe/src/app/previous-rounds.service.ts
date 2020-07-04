import { Injectable } from '@angular/core';
import { RoundService } from './round.service';
import * as firebase from 'firebase/app';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class PreviousRoundsService {
  private activeRound: string;
  private histRef: firebase.database.Query;

  constructor(private roundService: RoundService) {
    this.roundService.round$.subscribe(
      round => {
        if (round.id !== this.activeRound) {
          this.activeRound = round.id;
          this.histRef = firebase.database()
            .ref('rounds').orderByKey().limitToLast(4).endAt(this.activeRound);

          this.histRef.once('value', snap => {
            console.log(snap.val());
          });
        }
      }
    );

  }
}
