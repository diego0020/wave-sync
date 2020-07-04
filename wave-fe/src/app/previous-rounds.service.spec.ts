import { TestBed } from '@angular/core/testing';

import { PreviousRoundsService } from './previous-rounds.service';

describe('PreviousRoundsService', () => {
  let service: PreviousRoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousRoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
