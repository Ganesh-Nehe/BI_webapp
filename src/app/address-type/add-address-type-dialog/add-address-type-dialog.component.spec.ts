import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressTypeDialogComponent } from './add-address-type-dialog.component';

describe('AddAddressTypeDialogComponent', () => {
  let component: AddAddressTypeDialogComponent;
  let fixture: ComponentFixture<AddAddressTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAddressTypeDialogComponent]
    });
    fixture = TestBed.createComponent(AddAddressTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
