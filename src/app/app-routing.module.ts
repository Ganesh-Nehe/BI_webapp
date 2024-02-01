import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { BusinessComponent } from './business/business.component';
import { AttendenceComponent } from './attendence/attendence.component';

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
        path: 'attendence', 
        component: AttendenceComponent
      }
      // {
      //   path: '',
      //   component: DashboardComponent
      // }
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
