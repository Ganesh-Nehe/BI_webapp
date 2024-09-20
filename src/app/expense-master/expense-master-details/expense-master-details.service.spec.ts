import { TestBed } from '@angular/core/testing';

import { ExpenseMasterDetailsService } from './expense-master-details.service';

describe('ExpenseMasterDetailsService', () => {
  let service: ExpenseMasterDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseMasterDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
