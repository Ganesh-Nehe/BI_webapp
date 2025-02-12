import { TestBed } from '@angular/core/testing';

import { AddAddressTypeDialogService } from './add-address-type-dialog.service';

describe('AddAddressTypeDialogService', () => {
  let service: AddAddressTypeDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAddressTypeDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
