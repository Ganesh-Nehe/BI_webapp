import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelExpenseStatementComponent } from './travel-expense-statement.component';

describe('TravelExpenseStatementComponent', () => {
  let component: TravelExpenseStatementComponent;
  let fixture: ComponentFixture<TravelExpenseStatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelExpenseStatementComponent]
    });
    fixture = TestBed.createComponent(TravelExpenseStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
