import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentDialogComponent } from './advance-payment-dialog.component';

describe('AdvancePaymentDialogComponent', () => {
  let component: AdvancePaymentDialogComponent;
  let fixture: ComponentFixture<AdvancePaymentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancePaymentDialogComponent]
    });
    fixture = TestBed.createComponent(AdvancePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
