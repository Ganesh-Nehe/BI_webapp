import { TestBed } from '@angular/core/testing';

import { AddMaterialDialogService } from './add-material-dialog.service';

describe('AddMaterialDialogService', () => {
  let service: AddMaterialDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddMaterialDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
