import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelStatementDetailComponent } from './travel-statement-detail.component';

describe('TravelStatementDetailComponent', () => {
  let component: TravelStatementDetailComponent;
  let fixture: ComponentFixture<TravelStatementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelStatementDetailComponent]
    });
    fixture = TestBed.createComponent(TravelStatementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
