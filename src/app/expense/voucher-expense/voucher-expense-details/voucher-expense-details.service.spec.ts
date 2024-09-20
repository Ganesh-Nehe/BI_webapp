import { TestBed } from '@angular/core/testing';

import { VoucherExpenseDetailsService } from './voucher-expense-details.service';

describe('VoucherExpenseDetailsService', () => {
  let service: VoucherExpenseDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherExpenseDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
