import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { BusinessComponent } from './business/business.component';
import { EmployeeComponent } from './employee/employee.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseMasterComponent } from './expense-master/expense-master.component';
import { TravelExpenseComponent } from './expense/travel-expense/travel-expense.component';
import { VoucherExpenseComponent } from './expense/voucher-expense/voucher-expense.component';
import { AddVoucherheadComponent } from './expense/add-voucherhead/add-voucherhead.component';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent, 
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'business',
        component: BusinessComponent
      },
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: 'employee',
        component: EmployeeComponent
      },
      {
        path: 'expense',
        // component:  ExpenseComponent,
        children: [
          { path: 'travel', component: TravelExpenseComponent },
          { path: 'voucher', component:  VoucherExpenseComponent },
        ]
      },
      {
        path: 'expense-master',
        component: ExpenseMasterComponent
      },
      {
        path: 'voucher-head',
        component: AddVoucherheadComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
