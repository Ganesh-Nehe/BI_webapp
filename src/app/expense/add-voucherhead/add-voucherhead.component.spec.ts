import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoucherheadComponent } from './add-voucherhead.component';

describe('AddVoucherheadComponent', () => {
  let component: AddVoucherheadComponent;
  let fixture: ComponentFixture<AddVoucherheadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVoucherheadComponent]
    });
    fixture = TestBed.createComponent(AddVoucherheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
