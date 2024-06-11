import { TestBed } from '@angular/core/testing';

import { AddVoucherheadDialogService } from './add-voucherhead-dialog.service';

describe('AddVoucherheadDialogService', () => {
  let service: AddVoucherheadDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddVoucherheadDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
