import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoucherExpenseComponent } from './add-voucher-expense.component';

describe('AddVoucherExpenseComponent', () => {
  let component: AddVoucherExpenseComponent;
  let fixture: ComponentFixture<AddVoucherExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVoucherExpenseComponent]
    });
    fixture = TestBed.createComponent(AddVoucherExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
