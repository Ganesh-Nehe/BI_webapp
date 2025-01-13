import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementPaymentDialogComponent } from './statement-payment-dialog.component';

describe('StatementPaymentDialogComponent', () => {
  let component: StatementPaymentDialogComponent;
  let fixture: ComponentFixture<StatementPaymentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatementPaymentDialogComponent]
    });
    fixture = TestBed.createComponent(StatementPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
