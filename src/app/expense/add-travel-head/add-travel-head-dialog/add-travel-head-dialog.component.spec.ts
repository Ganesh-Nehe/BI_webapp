import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTravelHeadDialogComponent } from './add-travel-head-dialog.component';

describe('AddTravelHeadDialogComponent', () => {
  let component: AddTravelHeadDialogComponent;
  let fixture: ComponentFixture<AddTravelHeadDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTravelHeadDialogComponent]
    });
    fixture = TestBed.createComponent(AddTravelHeadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
