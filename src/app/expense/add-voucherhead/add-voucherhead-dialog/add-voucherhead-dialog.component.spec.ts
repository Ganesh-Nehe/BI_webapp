import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoucherheadDialogComponent } from './add-voucherhead-dialog.component';

describe('AddVoucherheadDialogComponent', () => {
  let component: AddVoucherheadDialogComponent;
  let fixture: ComponentFixture<AddVoucherheadDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVoucherheadDialogComponent]
    });
    fixture = TestBed.createComponent(AddVoucherheadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
