import { TestBed } from '@angular/core/testing';

import { InactivityService } from './inactivity-service.service';

describe('InactivityServiceService', () => {
  let service: InactivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InactivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
