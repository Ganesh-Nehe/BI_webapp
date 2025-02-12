import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialDialogComponent } from './add-material-dialog.component';

describe('AddMaterialDialogComponent', () => {
  let component: AddMaterialDialogComponent;
  let fixture: ComponentFixture<AddMaterialDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMaterialDialogComponent]
    });
    fixture = TestBed.createComponent(AddMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
