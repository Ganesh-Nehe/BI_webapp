import { TestBed } from '@angular/core/testing';

import { TravelExpenseStatementService } from './travel-expense-statement.service';

describe('TravelExpenseStatementService', () => {
  let service: TravelExpenseStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelExpenseStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
