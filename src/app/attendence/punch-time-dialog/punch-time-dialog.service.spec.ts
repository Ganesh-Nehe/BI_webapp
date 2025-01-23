import { TestBed } from '@angular/core/testing';

import { PunchTimeDialogService } from './punch-time-dialog.service';

describe('PunchTimeDialogService', () => {
  let service: PunchTimeDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PunchTimeDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
