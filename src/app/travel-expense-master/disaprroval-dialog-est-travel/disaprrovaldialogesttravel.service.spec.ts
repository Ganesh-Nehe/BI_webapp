import { TestBed } from '@angular/core/testing';

import { DisaprrovaldialogesttravelService } from './disaprrovaldialogesttravel.service';

describe('DisaprrovaldialogesttravelService', () => {
  let service: DisaprrovaldialogesttravelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisaprrovaldialogesttravelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
