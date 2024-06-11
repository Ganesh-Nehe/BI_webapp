import { TestBed } from '@angular/core/testing';

import { EmployeeAddEditService } from './employee-add-edit.service';

describe('EmployeeAddEditService', () => {
  let service: EmployeeAddEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAddEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
