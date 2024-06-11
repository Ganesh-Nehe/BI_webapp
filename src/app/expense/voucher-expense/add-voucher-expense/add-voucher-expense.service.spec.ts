import { TestBed } from '@angular/core/testing';

import { AddVoucherExpenseService } from './add-voucher-expense.service';

describe('AddVoucherExpenseService', () => {
  let service: AddVoucherExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddVoucherExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
