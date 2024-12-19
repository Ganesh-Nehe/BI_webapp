import { TestBed } from '@angular/core/testing';

import { AddTravelHeadService } from './add-travel-head.service';

describe('AddTravelHeadService', () => {
  let service: AddTravelHeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTravelHeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
