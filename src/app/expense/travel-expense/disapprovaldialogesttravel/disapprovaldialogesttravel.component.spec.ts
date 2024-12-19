import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisapprovaldialogesttravelComponent } from './disapprovaldialogesttravel.component';

describe('DisapprovaldialogesttravelComponent', () => {
  let component: DisapprovaldialogesttravelComponent;
  let fixture: ComponentFixture<DisapprovaldialogesttravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisapprovaldialogesttravelComponent]
    });
    fixture = TestBed.createComponent(DisapprovaldialogesttravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
