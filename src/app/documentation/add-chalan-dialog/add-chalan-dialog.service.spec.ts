import { TestBed } from '@angular/core/testing';

import { AddChalanDialogService } from './add-chalan-dialog.service';

describe('AddChalanDialogService', () => {
  let service: AddChalanDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddChalanDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
