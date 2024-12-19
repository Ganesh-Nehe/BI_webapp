import { TestBed } from '@angular/core/testing';

import { TravelExpenseService } from './travel-expense.service';

describe('TravelExpenseService', () => {
  let service: TravelExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
