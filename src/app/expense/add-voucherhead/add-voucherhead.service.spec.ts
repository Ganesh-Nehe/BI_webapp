import { TestBed } from '@angular/core/testing';

import { AddVoucherheadService } from './add-voucherhead.service';

describe('AddVoucherheadService', () => {
  let service: AddVoucherheadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddVoucherheadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
