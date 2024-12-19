import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateTravelExpenseDetailsComponent } from './estimate-travel-expense-details.component';

describe('EstimateTravelExpenseDetailsComponent', () => {
  let component: EstimateTravelExpenseDetailsComponent;
  let fixture: ComponentFixture<EstimateTravelExpenseDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimateTravelExpenseDetailsComponent]
    });
    fixture = TestBed.createComponent(EstimateTravelExpenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
