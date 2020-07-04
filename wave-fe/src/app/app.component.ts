import { Component, OnInit } from '@angular/core';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Wave Sync';
  constructor() { }

  ngOnInit() { }

}
