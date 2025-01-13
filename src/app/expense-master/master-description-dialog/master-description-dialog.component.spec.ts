import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDescriptionDialogComponent } from './master-description-dialog.component';

describe('MasterDescriptionDialogComponent', () => {
  let component: MasterDescriptionDialogComponent;
  let fixture: ComponentFixture<MasterDescriptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterDescriptionDialogComponent]
    });
    fixture = TestBed.createComponent(MasterDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
