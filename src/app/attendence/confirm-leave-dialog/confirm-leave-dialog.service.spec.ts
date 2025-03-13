import { TestBed } from '@angular/core/testing';

import { ConfirmLeaveDialogService } from './confirm-leave-dialog.service';

describe('ConfirmLeaveDialogService', () => {
  let service: ConfirmLeaveDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmLeaveDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
