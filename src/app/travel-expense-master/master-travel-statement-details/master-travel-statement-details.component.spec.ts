import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTravelStatementDetailsComponent } from './master-travel-statement-details.component';

describe('MasterTravelStatementDetailsComponent', () => {
  let component: MasterTravelStatementDetailsComponent;
  let fixture: ComponentFixture<MasterTravelStatementDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterTravelStatementDetailsComponent]
    });
    fixture = TestBed.createComponent(MasterTravelStatementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
