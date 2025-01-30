import { TestBed } from '@angular/core/testing';

import { AttendenceMasterService } from './attendence-master.service';

describe('AttendenceMasterService', () => {
  let service: AttendenceMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendenceMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
