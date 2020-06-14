import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-clues',
  templateUrl: './clues.component.html'
})
export class CluesComponent implements OnInit {

  constructor() { }
  @Input() clues: any;

  ngOnInit(): void {
  }

}
