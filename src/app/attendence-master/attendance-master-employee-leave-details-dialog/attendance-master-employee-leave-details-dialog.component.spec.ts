import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceMasterEmployeeLeaveDetailsDialogComponent } from './attendance-master-employee-leave-details-dialog.component';

describe('AttendanceMasterEmployeeLeaveDetailsDialogComponent', () => {
  let component: AttendanceMasterEmployeeLeaveDetailsDialogComponent;
  let fixture: ComponentFixture<AttendanceMasterEmployeeLeaveDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceMasterEmployeeLeaveDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(AttendanceMasterEmployeeLeaveDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
