import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChalanDialogComponent } from './add-chalan-dialog.component';

describe('AddChalanDialogComponent', () => {
  let component: AddChalanDialogComponent;
  let fixture: ComponentFixture<AddChalanDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddChalanDialogComponent]
    });
    fixture = TestBed.createComponent(AddChalanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
