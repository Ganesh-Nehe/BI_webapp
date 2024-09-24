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
    business: false,
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
      if (['dashboard', 'business', 'employee', 'expense', 'expenseMaster', 'voucherHead', 'currency'].includes(key)) {
        this.employeeForm.controls[key].setValue(this.selectAll);
      }
    });
  }

  dialogclose() {
    this.dialogRef.close();
  }

  addEmployeeData() {
    const baseApi = this.apiService.getBaseApi();
    const formData = { ...this.employeeForm.value }; 

    if (this.employeeForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };

      if (this.data) {
        this.employeeService.editEmployee(this.data.employeeId, formData).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
            this.snackBar.open('Employee updated successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top', 
              horizontalPosition: 'center',
              panelClass: ['snackbar-error']
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
        this.http.post(`${baseApi}/API/user/`, formData, httpOptions).subscribe(res => {
          this.dialogRef.close(true);
          this.snackBar.open('Employee created successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top', 
            horizontalPosition: 'center',
            panelClass: ['snackbar-error']
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
