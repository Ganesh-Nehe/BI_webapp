import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesciptionDialogEstTravelComponent } from './desciption-dialog-est-travel.component';

describe('DesciptionDialogEstTravelComponent', () => {
  let component: DesciptionDialogEstTravelComponent;
  let fixture: ComponentFixture<DesciptionDialogEstTravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesciptionDialogEstTravelComponent]
    });
    fixture = TestBed.createComponent(DesciptionDialogEstTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
