import { TestBed } from '@angular/core/testing';

import { VoucherExpenseService } from './voucher-expense.service';

describe('VoucherExpenseService', () => {
  let service: VoucherExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
