import { TestBed } from '@angular/core/testing';

import { ExpenseMasterService } from './expense-master.service';

describe('ExpenseMasterService', () => {
  let service: ExpenseMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
