import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseMasterDetailsComponent } from './expense-master-details.component';

describe('ExpenseMasterDetailsComponent', () => {
  let component: ExpenseMasterDetailsComponent;
  let fixture: ComponentFixture<ExpenseMasterDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseMasterDetailsComponent]
    });
    fixture = TestBed.createComponent(ExpenseMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
