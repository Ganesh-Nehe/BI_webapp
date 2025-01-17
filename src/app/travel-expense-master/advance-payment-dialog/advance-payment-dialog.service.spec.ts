import { TestBed } from '@angular/core/testing';

import { AdvancePaymentDialogService } from './advance-payment-dialog.service';

describe('AdvancePaymentDialogService', () => {
  let service: AdvancePaymentDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancePaymentDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
