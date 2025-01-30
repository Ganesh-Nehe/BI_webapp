import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSalarySlipDialogComponent } from './generate-salary-slip-dialog.component';

describe('GenerateSalarySlipDialogComponent', () => {
  let component: GenerateSalarySlipDialogComponent;
  let fixture: ComponentFixture<GenerateSalarySlipDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateSalarySlipDialogComponent]
    });
    fixture = TestBed.createComponent(GenerateSalarySlipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
