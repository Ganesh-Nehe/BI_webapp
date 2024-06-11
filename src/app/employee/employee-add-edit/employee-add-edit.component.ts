import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { APIService } from '../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeAddEditService } from './employee-add-edit.service';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './employee-add-edit.component.html',
  styleUrls: ['./employee-add-edit.component.css']
})
export class EmployeeAddEditComponent implements  OnInit {

  employeeForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    public apiService :APIService,
    private dialogRef: MatDialogRef<EmployeeAddEditComponent>,
    private employeeService: EmployeeAddEditService,
    @Inject(MAT_DIALOG_DATA) public data:any
    
  ) {
    this.employeeForm = this.fb.group({
      userFirstName: ['',Validators.required],
      userMiddleName: ['',Validators.required],
      userLastName: ['',Validators.required],
      designation: ['',Validators.required],
      telephone_no: ['',Validators.required],
      mobile_no: ['',Validators.required],
      emailId: ['',Validators.required],
      password: ['',Validators.required],
      auditDetail: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    this.employeeForm.patchValue(this.data);
  }

  dialogclose(){
    this.dialogRef.close();
  }

  addEmployeeData(){
    const baseApi = this.apiService.getBaseApi();
    const formData = this.employeeForm.value;

    if (this.employeeForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };

      if (this.data) {
        // Editing existing employee
        this.employeeService.editEmployee(this.data.userId, this.employeeForm.value).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating employee:', error);
            console.error('Error details:', error.error);
          }
        });
      } else {
        // Creating new employee
        this.http.post(`${baseApi}/API/user/`, formData, httpOptions).subscribe(res => {
          console.log("Successfully added the employee", res);
          this.dialogRef.close(true);
        }, error => {
          console.error('Error submitting data: ', error);
        });
      }
    }
  }
}
