import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { GuessService } from '../guess.service';
import { RoundService } from '../round.service';

@Component({
  selector: 'app-clues',
  templateUrl: './clues.component.html'
})
export class CluesComponent implements OnInit {
  @Input() clues: any;
  isGuestPlayer$: Observable<boolean>;

  constructor(private guessService: GuessService, private roundService: RoundService) {
    this.isGuestPlayer$ = roundService.isGuestPlayer$;
  }

  get startClasses(): string {
    const color = this.clues?.startColor;
    return `bg-${color}-400 text-${color}-400`;
  }

  get endClasses(): string {
    const color = this.clues?.endColor;
    return `bg-${color}-400 text-${color}-400`;
  }

  moveNeedle(delta: number) {
    this.guessService.moveNeedle(delta);
  }

  ngOnInit(): void {
  }

}
