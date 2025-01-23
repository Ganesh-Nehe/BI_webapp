import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceMasterComponent } from './attendence-master.component';

describe('AttendenceMasterComponent', () => {
  let component: AttendenceMasterComponent;
  let fixture: ComponentFixture<AttendenceMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendenceMasterComponent]
    });
    fixture = TestBed.createComponent(AttendenceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
