import { TestBed } from '@angular/core/testing';

import { TravelExpenseMasterService } from './travel-expense-master.service';

describe('TravelExpenseMasterService', () => {
  let service: TravelExpenseMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelExpenseMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
