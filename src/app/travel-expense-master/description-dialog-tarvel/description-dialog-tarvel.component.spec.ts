import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionDialogTarvelComponent } from './description-dialog-tarvel.component';

describe('DescriptionDialogTarvelComponent', () => {
  let component: DescriptionDialogTarvelComponent;
  let fixture: ComponentFixture<DescriptionDialogTarvelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionDialogTarvelComponent]
    });
    fixture = TestBed.createComponent(DescriptionDialogTarvelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
