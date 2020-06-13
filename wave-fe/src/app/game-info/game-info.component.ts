import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styles: [
  ]
})
export class GameInfoComponent implements OnInit {
  @Input() userId: number;

  constructor() { }

  ngOnInit(): void {
  }

}
