import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wave-fe';
  value = 42;

  ngOnInit() {
    console.log('init');
    const starCountRef = firebase.database().ref('games/IyN3LKwbM5SKrXzC5Lnz/guess');
    starCountRef.on('value', (snapshot) => {
      console.log(snapshot);
      this.value = snapshot.val();
    });
  }
}
