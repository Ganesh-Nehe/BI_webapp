import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChalanDialogComponent } from './view-chalan-dialog.component';

describe('ViewChalanDialogComponent', () => {
  let component: ViewChalanDialogComponent;
  let fixture: ComponentFixture<ViewChalanDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewChalanDialogComponent]
    });
    fixture = TestBed.createComponent(ViewChalanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
