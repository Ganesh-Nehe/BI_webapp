import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { APIService } from '../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessAddEditService } from './business-add-edit.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-business-add-edit',
  templateUrl: './business-add-edit.component.html',
  styleUrls: ['./business-add-edit.component.css']
})
export class BusinessAddEditComponent implements OnInit {

  businessForm: FormGroup;
  selectedFile: File = null!;
  selectAll: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private businessService: BusinessAddEditService,
    private dialogRef: MatDialogRef<BusinessAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    const isUpdateMode = !!this.data;
    this.businessForm = this.fb.group({
      businessName: ['', Validators.required],
      CIN_no: ['', Validators.required],
      PAN_no: ['', Validators.required],
      addressTypeId: ['', Validators.required],
      addressLine_1: ['', Validators.required],
      addressLine_2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      isoCountryCode: ['', Validators.required],
      pinCode: ['', Validators.required],
      auditDetail: [this.data ? '' : null, this.data ? [Validators.required, Validators.minLength(20)] : null],
      // Admin controls (Only for adding)
      employeeFirstName: this.data ? null : ['', Validators.required],
      employeeMiddleName: this.data ? null : ['', Validators.required],
      employeeLastName: this.data ? null : ['', Validators.required],
      emailId: this.data ? null : ['', [Validators.required, Validators.email]],
      password: this.data ? null : ['', Validators.required],
      mobile_no: this.data ? null : ['', Validators.required],
      bankId: this.data ? null : ['', Validators.required],
      profilephoto: this.data ? null : ['', Validators.required],
      // Checkbox controls for permissions
      dashboard: [false],
      employee: [false],
      expense: [false],
      expenseMaster: [false],
      voucherHead: [false],
      currency: [false]
    });

  }
  dialogclose() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.businessForm.patchValue(this.data)
  }

  toggleAllCheckboxes() {
    const checkState = !this.selectAll;
    this.selectAll = checkState;
    Object.keys(this.businessForm.controls).forEach(key => {
      if (['dashboard', 'employee', 'expense', 'expenseMaster', 'voucherHead', 'currency'].includes(key)) {
        this.businessForm.get(key)?.setValue(checkState);
      }
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async addBusinessData() {
    if (this.businessForm.valid) {
      const formData = new FormData();
      
      // Append business data
      formData.append('businessName', this.businessForm.get('businessName')?.value);
      formData.append('CIN_no', this.businessForm.get('CIN_no')?.value);
      formData.append('PAN_no', this.businessForm.get('PAN_no')?.value);
  
      // Append address data
      formData.append('addressTypeId', this.businessForm.get('addressTypeId')?.value);
      formData.append('addressLine_1', this.businessForm.get('addressLine_1')?.value);
      formData.append('addressLine_2', this.businessForm.get('addressLine_2')?.value);
      formData.append('city', this.businessForm.get('city')?.value);
      formData.append('state', this.businessForm.get('state')?.value);
      formData.append('isoCountryCode', this.businessForm.get('isoCountryCode')?.value);
      formData.append('pinCode', this.businessForm.get('pinCode')?.value);
  
      // Append file if exists
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
  
      // Collect checkbox values into an array
      const permissions: number[] = [];
      if (this.businessForm.get('dashboard')?.value === true) permissions.push(1); // Dashboard
      if (this.businessForm.get('employee')?.value === true) permissions.push(3); // Employee
      if (this.businessForm.get('expense')?.value === true) permissions.push(4); // Expense
      if (this.businessForm.get('expenseMaster')?.value === true) permissions.push(5); // Expense Master
      if (this.businessForm.get('voucherHead')?.value === true) permissions.push(6); // Voucher Head
      if (this.businessForm.get('currency')?.value === true) permissions.push(7); // Currency
  
      // Append permissions as JSON string
      formData.append('permissions', JSON.stringify(permissions));
  
      try {
        if (this.data) {
          // Edit business with file
          formData.append('auditDetail', this.businessForm.get('auditDetail')?.value);
          await this.businessService.editBusiness(this.data.businessID, formData);
          this.dialogRef.close(true);
          this.snackBar.open('Business updated successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        } else {
          // Append admin user data for new business
          formData.append('employeeFirstName', this.businessForm.get('employeeFirstName')?.value);
          formData.append('employeeMiddleName', this.businessForm.get('employeeMiddleName')?.value);
          formData.append('employeeLastName', this.businessForm.get('employeeLastName')?.value);
          formData.append('emailId', this.businessForm.get('emailId')?.value);
          formData.append('password', this.businessForm.get('password')?.value);
          formData.append('mobile_no', this.businessForm.get('mobile_no')?.value);
          formData.append('bankId', this.businessForm.get('bankId')?.value);
          formData.append('profilephoto', this.businessForm.get('profilephoto')?.value);
  
          // Add new business with file
          await this.businessService.addBusiness(formData);
          this.dialogRef.close(true);
          this.snackBar.open('Business added successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        }
      } catch (error) {
        console.error('Error handling business data:', error);
        this.snackBar.open(this.data ? 'Error updating business' : 'Error adding business', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    }
  }
}
