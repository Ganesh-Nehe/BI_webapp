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
import { CurrenyComponent } from './curreny/curreny.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AddTravelHeadComponent } from './expense/add-travel-head/add-travel-head.component';
import { TravelExpenseMasterComponent } from './travel-expense-master/travel-expense-master.component';
import { AttendenceComponent } from './attendence/attendence.component';
import { AttendenceMasterComponent } from './attendence-master/attendence-master.component';
import { LeaveMasterComponent } from './attendence/leave-master/leave-master.component';

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
        children: [
          { path: 'travel', component: TravelExpenseComponent },
          { path: 'miscellaneous', component:  VoucherExpenseComponent },
        ]
      },
      {
        path: 'attendence',
        component: AttendenceComponent
      },
      {
        path: 'miscellaneous-summary',
        component: ExpenseMasterComponent
      },
      {
        path: 'travel-summary',
        component: TravelExpenseMasterComponent
      },
      {
        path: 'attendence-summary',
        component: AttendenceMasterComponent
      },
      {
        path: 'voucher-head',
        component: AddVoucherheadComponent
      },
      {
        path: 'travel-head',
        component: AddTravelHeadComponent
      },
      {
        path: 'currency',
        component: CurrenyComponent
      },
      {
        path: 'leave',
        component: LeaveMasterComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent
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
