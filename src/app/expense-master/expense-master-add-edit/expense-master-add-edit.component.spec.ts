import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseMasterAddEditComponent } from './expense-master-add-edit.component';

describe('ExpenseMasterAddEditComponent', () => {
  let component: ExpenseMasterAddEditComponent;
  let fixture: ComponentFixture<ExpenseMasterAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseMasterAddEditComponent]
    });
    fixture = TestBed.createComponent(ExpenseMasterAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
