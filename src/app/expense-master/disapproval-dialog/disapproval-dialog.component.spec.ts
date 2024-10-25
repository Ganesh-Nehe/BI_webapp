import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisapprovalDialogComponent } from './disapproval-dialog.component';

describe('DisapprovalDialogComponent', () => {
  let component: DisapprovalDialogComponent;
  let fixture: ComponentFixture<DisapprovalDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisapprovalDialogComponent]
    });
    fixture = TestBed.createComponent(DisapprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
