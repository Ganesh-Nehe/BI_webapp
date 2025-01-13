import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisapprovaldialogstatementComponent } from './disapprovaldialogstatement.component';

describe('DisapprovaldialogstatementComponent', () => {
  let component: DisapprovaldialogstatementComponent;
  let fixture: ComponentFixture<DisapprovaldialogstatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisapprovaldialogstatementComponent]
    });
    fixture = TestBed.createComponent(DisapprovaldialogstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
