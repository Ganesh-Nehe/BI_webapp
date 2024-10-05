import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { APIService } from '../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeAddEditService } from './employee-add-edit.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './employee-add-edit.component.html',
  styleUrls: ['./employee-add-edit.component.css']
})
export class EmployeeAddEditComponent implements OnInit {

  employeeForm: FormGroup;
  selectAll: boolean = false;

  checkboxes = {
    dashboard: false,
    employee: false,
    expense: false,
    expenseMaster: false,
    voucherHead: false,
    currency: false
  };

  constructor(private fb: FormBuilder, 
              private http: HttpClient,
              public apiService: APIService,
              private dialogRef: MatDialogRef<EmployeeAddEditComponent>,
              private employeeService: EmployeeAddEditService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackBar: MatSnackBar) {
    this.employeeForm = this.fb.group({
      employeeFirstName: ['', Validators.required],
      employeeMiddleName: ['', Validators.required],
      employeeLastName: ['', Validators.required],
      emailId: ['', Validators.required],
      password: ['', !this.data ? Validators.required : null],
      mobile_no: ['', Validators.required],
      bankId: ['', Validators.required],
      profilephoto: ['', Validators.required],
      auditDetail: [this.data ? '' : null, this.data ? Validators.required : null],

      dashboard: [false],
      business: [false],
      employee: [false],
      expense: [false],
      expenseMaster: [false],
      voucherHead: [false],
      currency: [false]
    });
  }

  ngOnInit(): void {
    this.employeeForm.patchValue(this.data);
  }

  toggleAllCheckboxes() {
    this.selectAll = !this.selectAll;
    Object.keys(this.employeeForm.controls).forEach(key => {
      if (['dashboard', 'employee', 'expense', 'expenseMaster', 'voucherHead', 'currency'].includes(key)) {
        this.employeeForm.controls[key].setValue(this.selectAll);
      }
    });
  }

  dialogclose() {
    this.dialogRef.close();
  }

  addEmployeeData() {
    const baseApi = this.apiService.getBaseApi();
  
    if (this.employeeForm.valid) {
      const formData = new FormData();
  
      // Append employee data
      formData.append('employeeFirstName', this.employeeForm.get('employeeFirstName')?.value);
      formData.append('employeeMiddleName', this.employeeForm.get('employeeMiddleName')?.value);
      formData.append('employeeLastName', this.employeeForm.get('employeeLastName')?.value);
      formData.append('emailId', this.employeeForm.get('emailId')?.value);
      formData.append('mobile_no', this.employeeForm.get('mobile_no')?.value);
      formData.append('bankId', this.employeeForm.get('bankId')?.value);
      formData.append('profilephoto', this.employeeForm.get('profilephoto')?.value);
      if (!this.data) {
        formData.append('password', this.employeeForm.get('password')?.value);
      }
  
      // Collect permissions into an array
      const permissions: number[] = [];
  
      if (this.employeeForm.get('dashboard')?.value === true) {
        permissions.push(1); // Dashboard
      }
      if (this.employeeForm.get('employee')?.value === true) {
        permissions.push(3); // Employee
      }
      if (this.employeeForm.get('expense')?.value === true) {
        permissions.push(4); // Expense
      }
      if (this.employeeForm.get('expenseMaster')?.value === true) {
        permissions.push(5); // Expense Master
      }
      if (this.employeeForm.get('voucherHead')?.value === true) {
        permissions.push(6); // Voucher Head
      }
      if (this.employeeForm.get('currency')?.value === true) {
        permissions.push(7); // Currency
      }
  
      // Append the permissions array as a JSON string
      formData.append('permissions', JSON.stringify(permissions));
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };
  
      if (this.data) {
        // If updating
        this.employeeService.editEmployee(this.data.employeeId, formData).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
            this.snackBar.open('Employee updated successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-success']
            });
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open('Error updating employee', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-error']
            });
          }
        });
      } else {
        // If creating new
        this.http.post(`${baseApi}/API/user/`, formData, httpOptions).subscribe(res => {
          this.dialogRef.close(true);
          this.snackBar.open('Employee created successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        }, error => {
          this.snackBar.open('Error creating employee', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-error']
          });
        });
      }
    }
  }  
}
