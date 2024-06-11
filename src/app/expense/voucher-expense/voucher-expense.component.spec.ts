import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherExpenseComponent } from './voucher-expense.component';

describe('VoucherExpenseComponent', () => {
  let component: VoucherExpenseComponent;
  let fixture: ComponentFixture<VoucherExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherExpenseComponent]
    });
    fixture = TestBed.createComponent(VoucherExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
