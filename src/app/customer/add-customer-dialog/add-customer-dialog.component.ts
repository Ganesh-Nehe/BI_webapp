import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCustomerDialogService } from './add-customer-dialog.service'

@Component({
  selector: 'app-add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  styleUrls: ['./add-customer-dialog.component.css']
})
export class AddCustomerDialogComponent {

  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: APIService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddCustomerDialogComponent>,
    private addCustomerDialogService: AddCustomerDialogService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.customerForm = this.fb.group({
      projectName: ['', Validators.required],
      branches: this.fb.array([])
    });
    this.addBranch();
  }

  ngOnInit(): void {
  }

  get branches(): FormArray {
    return this.customerForm.get('branches') as FormArray;
  }

  createBranch(): FormGroup {
    return this.fb.group({
      location: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pinCode: ['', Validators.required]
    });
  }

  addBranch(): void {
    this.branches.push(this.createBranch());
  }

  removeBranch(index: number): void {
    this.branches.removeAt(index);
  }
  
  saveCustomer(): void {
    if (this.customerForm.valid) {
      console.log(this.customerForm.value);
      this.snackBar.open('Customer saved successfully!', 'Close', { duration: 2000 });
      this.dialogRef.close();
    } else {
      this.snackBar.open('Please fill all required fields!', 'Close', { duration: 2000 });
    }
  }

}
