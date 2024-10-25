import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionDetailDialogComponent } from './description-detail-dialog.component';

describe('DescriptionDetailDialogComponent', () => {
  let component: DescriptionDetailDialogComponent;
  let fixture: ComponentFixture<DescriptionDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionDetailDialogComponent]
    });
    fixture = TestBed.createComponent(DescriptionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
