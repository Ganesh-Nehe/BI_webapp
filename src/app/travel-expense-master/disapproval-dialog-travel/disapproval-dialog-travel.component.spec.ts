import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisapprovalDialogTravelComponent } from './disapproval-dialog-travel.component';

describe('DisapprovalDialogTravelComponent', () => {
  let component: DisapprovalDialogTravelComponent;
  let fixture: ComponentFixture<DisapprovalDialogTravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisapprovalDialogTravelComponent]
    });
    fixture = TestBed.createComponent(DisapprovalDialogTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
