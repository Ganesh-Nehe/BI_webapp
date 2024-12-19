import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTravelHeadComponent } from './add-travel-head.component';

describe('AddTravelHeadComponent', () => {
  let component: AddTravelHeadComponent;
  let fixture: ComponentFixture<AddTravelHeadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTravelHeadComponent]
    });
    fixture = TestBed.createComponent(AddTravelHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
