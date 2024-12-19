import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelExpenseMasterComponent } from './travel-expense-master.component';

describe('TravelExpenseMasterComponent', () => {
  let component: TravelExpenseMasterComponent;
  let fixture: ComponentFixture<TravelExpenseMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelExpenseMasterComponent]
    });
    fixture = TestBed.createComponent(TravelExpenseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
