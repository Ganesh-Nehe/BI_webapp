import { TestBed } from '@angular/core/testing';

import { AddCustomerDialogService } from './add-customer-dialog.service';

describe('AddCustomerDialogService', () => {
  let service: AddCustomerDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCustomerDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
