import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrenyComponent } from './curreny.component';

describe('CurrenyComponent', () => {
  let component: CurrenyComponent;
  let fixture: ComponentFixture<CurrenyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrenyComponent]
    });
    fixture = TestBed.createComponent(CurrenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
