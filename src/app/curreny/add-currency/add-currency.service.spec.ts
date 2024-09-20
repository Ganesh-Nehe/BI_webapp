import { TestBed } from '@angular/core/testing';

import { AddCurrencyService } from './add-currency.service';

describe('AddCurrencyService', () => {
  let service: AddCurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
