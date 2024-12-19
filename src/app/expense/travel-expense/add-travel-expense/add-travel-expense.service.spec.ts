import { TestBed } from '@angular/core/testing';

import { AddTravelExpenseService } from './add-travel-expense.service';

describe('AddTravelExpenseService', () => {
  let service: AddTravelExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTravelExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
