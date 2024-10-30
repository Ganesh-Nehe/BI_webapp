import { TestBed } from '@angular/core/testing';

import { PaymentDialogService } from './payment-dialog.service';

describe('PaymentDialogService', () => {
  let service: PaymentDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
