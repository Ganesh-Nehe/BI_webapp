import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
    dashboard: [false],
    employee: [false],
    attendance: [false],
    customer: [false],
    expense: [false],
    summary: [false],
    documentation: [false],
    master: [false]
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public apiService: APIService,
    private dialogRef: MatDialogRef<EmployeeAddEditComponent>,
    private employeeService: EmployeeAddEditService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      employeeFirstName: ['', Validators.required],
      employeeMiddleName: ['', Validators.required],
      employeeLastName: ['', Validators.required],
      emailId: ['', Validators.required],
      password: ['', !this.data ? Validators.required : null],
      mobile_no: ['', Validators.required],
      auditDetail: [this.data ? '' : null, this.data ? Validators.required : null],
      dashboard: [false],
      employee: [false],
      attendance: [false],
      customer: [false],
      expense: [false],
      summary: [false],
      documentation: [false],
      master: [false]
    });
  }

  ngOnInit(): void {
    this.employeeForm.patchValue(this.data);
  }

  toggleAllCheckboxes() {
    this.selectAll = !this.selectAll;
    Object.keys(this.employeeForm.controls).forEach(key => {
      if (['dashboard', 'employee', 'attendance', 'attendance', 'customer', 'expense', 'summary', 'documentation', 'master'].includes(key)) {
        this.employeeForm.controls[key].setValue(this.selectAll);
      }
    });
  }

  dialogclose() {
    this.dialogRef.close();
  }

  isAnyPermissionChecked(): boolean {
    const controls = this.employeeForm.controls;
    return (
      controls['dashboard'].value ||
      controls['employee'].value ||
      controls['attendance'].value ||
      controls['customer'].value ||
      controls['expense'].value ||
      controls['summary'].value ||
      controls['documentation'].value ||
      controls['master'].value
    );
  }

  async addEmployeeData() {
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId');

    if (this.employeeForm.valid) {
      const formData = new FormData();
  
      // Append employee data
      formData.append('employeeFirstName', this.employeeForm.get('employeeFirstName')?.value);
      formData.append('employeeMiddleName', this.employeeForm.get('employeeMiddleName')?.value);
      formData.append('employeeLastName', this.employeeForm.get('employeeLastName')?.value);
      formData.append('emailId', this.employeeForm.get('emailId')?.value);
      formData.append('mobile_no', this.employeeForm.get('mobile_no')?.value);
      formData.append('auditDetail', this.employeeForm.get('auditDetail')?.value);

      if (businessId !== null) {
        formData.append('businessId', businessId);
      }
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };
  
      // Always collect permissions if not updating
      if (!this.data) {
        formData.append('password', this.employeeForm.get('password')?.value);
        
        // Collect permissions into [an array for new employee only
        const permissions: number[] = [];
        if (this.employeeForm.get('dashboard')?.value === true) permissions.push(1); // Dashboard
        if (this.employeeForm.get('employee')?.value === true) permissions.push(3); // Employee
        if (this.employeeForm.get('attendance')?.value === true) permissions.push(4); // Attendance
        if (this.employeeForm.get('customer')?.value === true) permissions.push(5); // customer
        if (this.employeeForm.get('expense')?.value === true) permissions.push(6); // Expense
        if (this.employeeForm.get('summary')?.value === true) permissions.push(7); // Summary Module
        if (this.employeeForm.get('documentation')?.value === true) permissions.push(8); // Ducumentation Module
        if (this.employeeForm.get('master')?.value === true) permissions.push(9); // Master Module


  
        // Append the permissions array as a JSON string
        formData.append('permissions', JSON.stringify(permissions));
      }
  
      try {
        if (this.data) {
          formData.append('employeeId', this.data.employeeId); 
          // If updating, send the employeeId and the updated data
          await this.employeeService.editEmployee(this.data.employeeId, formData);
          this.dialogRef.close(true);
          this.snackBar.open('Employee updated successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        } else {
          // If creating new
          await this.http.post(`${baseApi}/API/user/`, formData, httpOptions).toPromise();
          this.dialogRef.close(true);
          this.snackBar.open('Employee created successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        }
      } catch (error) {
        const errorMsg = this.data ? 'Error updating employee' : 'Error creating employee';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    }
  }
}
