import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherExpenseDetailsComponent } from './voucher-expense-details.component';

describe('VoucherExpenseDetailsComponent', () => {
  let component: VoucherExpenseDetailsComponent;
  let fixture: ComponentFixture<VoucherExpenseDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherExpenseDetailsComponent]
    });
    fixture = TestBed.createComponent(VoucherExpenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
