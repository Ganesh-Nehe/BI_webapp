import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAddEditComponent } from './business-add-edit.component';

describe('BusinessAddEditComponent', () => {
  let component: BusinessAddEditComponent;
  let fixture: ComponentFixture<BusinessAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessAddEditComponent]
    });
    fixture = TestBed.createComponent(BusinessAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
