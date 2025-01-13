import { TestBed } from '@angular/core/testing';

import { DisapprovalDialogTravelService } from './disapproval-dialog-travel.service';

describe('DisapprovalDialogTravelService', () => {
  let service: DisapprovalDialogTravelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisapprovalDialogTravelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
