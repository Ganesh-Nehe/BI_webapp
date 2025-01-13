import { TestBed } from '@angular/core/testing';

import { StatementPaymentDialogComponentService } from './statement-payment-dialog-component.service';

describe('StatementPaymentDialogComponentService', () => {
  let service: StatementPaymentDialogComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatementPaymentDialogComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
