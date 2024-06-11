import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSubmenuComponent } from './expense-submenu.component';

describe('ExpenseSubmenuComponent', () => {
  let component: ExpenseSubmenuComponent;
  let fixture: ComponentFixture<ExpenseSubmenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseSubmenuComponent]
    });
    fixture = TestBed.createComponent(ExpenseSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
