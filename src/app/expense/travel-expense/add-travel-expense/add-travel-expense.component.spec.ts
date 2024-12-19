import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTravelExpenseComponent } from './add-travel-expense.component';

describe('AddTravelExpenseComponent', () => {
  let component: AddTravelExpenseComponent;
  let fixture: ComponentFixture<AddTravelExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTravelExpenseComponent]
    });
    fixture = TestBed.createComponent(AddTravelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
