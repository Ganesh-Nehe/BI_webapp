import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchTimeDialogComponent } from './punch-time-dialog.component';

describe('PunchTimeDialogComponent', () => {
  let component: PunchTimeDialogComponent;
  let fixture: ComponentFixture<PunchTimeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PunchTimeDialogComponent]
    });
    fixture = TestBed.createComponent(PunchTimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
