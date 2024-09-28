import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { APIService } from '../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessAddEditService } from './business-add-edit.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-business-add-edit',
  templateUrl: './business-add-edit.component.html',
  styleUrls: ['./business-add-edit.component.css']
})
export class BusinessAddEditComponent implements OnInit{

  businessForm: FormGroup;
  selectedFile: File = null!;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private businessService: BusinessAddEditService,
    private dialogRef: MatDialogRef<BusinessAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
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
      auditDetail: [this.data ? '' : null, this.data ? [Validators.required, Validators.minLength(20)] : null]
    });

  }
  dialogclose(){
    this.dialogRef.close();
  }
  ngOnInit(): void{
    this.businessForm.patchValue(this.data)
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addBusinessData() {
    const baseApi = this.apiService.getBaseApi();
  
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
      if (this.data) {
        formData.append('auditDetail', this.businessForm.get('auditDetail')?.value);
      }
      if (this.data) {
        // Update the business with file
        this.businessService.editBusiness(this.data.businessID, formData).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
            this.snackBar.open('Bussiness updated successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-success']
            });
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open('Error updating business', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-error']
            });
          }
        });
      } else {
        // Add new business with file
        this.businessService.addBusiness(formData).subscribe(response => {
          this.dialogRef.close(true);
          this.snackBar.open('Bussiness added successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        }, error => {
          this.snackBar.open('Error adding business', 'Close', {
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
