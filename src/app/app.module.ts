import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidenavComponent } from './sidenav/sidenav.component'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { UserComponent } from './user/user.component';
import { BusinessComponent } from './business/business.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { HeaderComponent } from './header/header.component';
import { BusinessAddEditComponent } from './business/business-add-edit/business-add-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { BusinessDetailsComponent } from './business/business-details/business-details.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeAddEditComponent } from './employee/employee-add-edit/employee-add-edit.component';
import { EmployeeDetailsComponent } from './employee/employee-details/employee-details.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseMasterComponent } from './expense-master/expense-master.component';
import { TravelExpenseComponent } from './expense/travel-expense/travel-expense.component';
import { VoucherExpenseComponent } from './expense/voucher-expense/voucher-expense.component';
import { ExpenseSubmenuComponent } from './expense/expense-submenu/expense-submenu.component';
import { MatMenuModule } from '@angular/material/menu';
import { AddVoucherheadComponent } from './expense/add-voucherhead/add-voucherhead.component';
import { AddVoucherheadDialogComponent } from './expense/add-voucherhead/add-voucherhead-dialog/add-voucherhead-dialog.component';
import { AddVoucherExpenseComponent } from './expense/voucher-expense/add-voucher-expense/add-voucher-expense.component';
import { VoucherExpenseDetailsComponent } from './expense/voucher-expense/voucher-expense-details/voucher-expense-details.component';
import { ExpenseMasterAddEditComponent } from './expense-master/expense-master-add-edit/expense-master-add-edit.component';
import { CurrenyComponent } from './curreny/curreny.component';
import { AddCurrencyComponent } from './curreny/add-currency/add-currency.component';
import { ExpenseMasterDetailsComponent } from './expense-master/expense-master-details/expense-master-details.component'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DisapprovalDialogComponent } from './expense-master/disapproval-dialog/disapproval-dialog.component';
import { DescriptionDetailDialogComponent } from './expense/voucher-expense/description-detail-dialog/description-detail-dialog.component';
import { PaymentDialogComponent } from './expense-master/payment-dialog/payment-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    SidenavComponent,
    UserComponent,
    BusinessComponent,
    HeaderComponent,
    BusinessAddEditComponent,
    BusinessDetailsComponent,
    EmployeeComponent,
    EmployeeAddEditComponent,
    EmployeeDetailsComponent,
    ExpenseComponent,
    ExpenseMasterComponent,
    TravelExpenseComponent,
    VoucherExpenseComponent,
    ExpenseSubmenuComponent,
    AddVoucherheadComponent,
    AddVoucherheadDialogComponent,
    AddVoucherExpenseComponent,
    VoucherExpenseDetailsComponent,
    ExpenseMasterAddEditComponent,
    CurrenyComponent,
    AddCurrencyComponent,
    ExpenseMasterDetailsComponent,
    UserProfileComponent,
    DisapprovalDialogComponent,
    DescriptionDetailDialogComponent,
    PaymentDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonToggleModule,
    MatMenuModule,
    CommonModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  providers: [BnNgIdleService,BusinessAddEditComponent],
  bootstrap: [AppComponent]

})
export class AppModule { }
