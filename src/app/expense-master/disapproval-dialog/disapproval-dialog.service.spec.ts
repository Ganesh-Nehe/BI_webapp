import { TestBed } from '@angular/core/testing';

import { DisapprovalDialogService } from './disapproval-dialog.service';

describe('DisapprovalDialogService', () => {
  let service: DisapprovalDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisapprovalDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
