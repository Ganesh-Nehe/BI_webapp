import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationReturnedDialogComponent } from './confirmation-returned-dialog.component';

describe('ConfirmationReturnedDialogComponent', () => {
  let component: ConfirmationReturnedDialogComponent;
  let fixture: ComponentFixture<ConfirmationReturnedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationReturnedDialogComponent]
    });
    fixture = TestBed.createComponent(ConfirmationReturnedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
