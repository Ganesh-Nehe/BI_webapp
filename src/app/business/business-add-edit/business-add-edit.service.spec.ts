import { TestBed } from '@angular/core/testing';

import { BusinessAddEditService } from './business-add-edit.service';

describe('BusinessAddEditService', () => {
  let service: BusinessAddEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessAddEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
