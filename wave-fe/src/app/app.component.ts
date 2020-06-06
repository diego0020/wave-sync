import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';

const gameRef = 'games/IyN3LKwbM5SKrXzC5Lnz';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wave-fe';
  guess = 42;
  saving = false;

  ngOnInit() {
    console.log('init');
    const starCountRef = firebase.database().ref(gameRef + '/guess');
    starCountRef.on('value', (snapshot) => {
      this.guess = snapshot.val();
    });
  }

  moveNeedle(delta) {
    console.log(delta);
    this.saving = true;
    firebase.database().ref(gameRef).update({
      guess: this.guess + delta
    }, (error) => {
      if (error) {
        console.warn(error);
      }
      this.saving = false;
    });
  }
}
