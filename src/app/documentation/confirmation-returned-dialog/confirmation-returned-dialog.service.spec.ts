import { TestBed } from '@angular/core/testing';

import { ConfirmationReturnedDialogService } from './confirmation-returned-dialog.service';

describe('ConfirmationReturnedDialogService', () => {
  let service: ConfirmationReturnedDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationReturnedDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
