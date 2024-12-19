import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateTravelExpenseDetailsMasterComponent } from './estimate-travel-expense-details-master.component';

describe('EstimateTravelExpenseDetailsMasterComponent', () => {
  let component: EstimateTravelExpenseDetailsMasterComponent;
  let fixture: ComponentFixture<EstimateTravelExpenseDetailsMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimateTravelExpenseDetailsMasterComponent]
    });
    fixture = TestBed.createComponent(EstimateTravelExpenseDetailsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
