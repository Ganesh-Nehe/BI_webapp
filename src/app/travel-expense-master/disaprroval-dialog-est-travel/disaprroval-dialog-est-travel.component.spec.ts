import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisaprrovalDialogEstTravelComponent } from './disaprroval-dialog-est-travel.component';

describe('DisaprrovalDialogEstTravelComponent', () => {
  let component: DisaprrovalDialogEstTravelComponent;
  let fixture: ComponentFixture<DisaprrovalDialogEstTravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisaprrovalDialogEstTravelComponent]
    });
    fixture = TestBed.createComponent(DisaprrovalDialogEstTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
