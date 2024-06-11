import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { APIService } from '../../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessAddEditService } from './business-add-edit.service';

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
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {
    const isUpdateMode = !!this.data;
    this.businessForm = this.fb.group({
      businessName: ['', Validators.required],
      CIN_no: ['', Validators.required],
      PAN_no: ['', Validators.required],
      logoFileLocation: ['',Validators.required],
      addressTypeId: ['', Validators.required],
      addressLine_1: ['', Validators.required],
      addressLine_2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      isoCountryCode: ['', Validators.required],
      pinCode: ['', Validators.required],
      auditDetail: ['', [Validators.required, Validators.minLength(20)]]
    });

  }
  dialogclose(){
    this.dialogRef.close();
  }
  ngOnInit(): void{
    this.businessForm.patchValue(this.data)
  }

  onFileSelected(event: any) {
    // Handle file selection and store it in the component property
    this.selectedFile = event.target.files[0];
  }

  addBusinessData() {
    const baseApi = this.apiService.getBaseApi();
    const businessFormData = this.businessForm.value;
  
    if (this.businessForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };

      if (this.data) {
        // Editing existing business
        this.businessService.editBusiness(this.data.businessID, this.businessForm.value).subscribe({
          next: (val: any) => {
            this.dialogRef.close(true);
          },
          error: (error: HttpErrorResponse) => {
            console.log("Some Error Occurred!");
          }
        });
      } else {
        const formData = {
            businessName: businessFormData.businessName,
            CIN_no: businessFormData.CIN_no,
            PAN_no: businessFormData.PAN_no,
            logoFileLocation: businessFormData.logoFileLocation,
            addressTypeId: businessFormData.addressTypeId,
            addressLine_1: businessFormData.addressLine_1,
            addressLine_2: businessFormData.addressLine_2,
            city: businessFormData.city,
            state: businessFormData.state,
            isoCountryCode: businessFormData.isoCountryCode,
            pinCode: businessFormData.pinCode,
        };
  
        this.http.post(`${baseApi}API/business/`, formData, httpOptions)
          .subscribe(response => {
            console.log('Data submitted successfully:', response);
            this.dialogRef.close(true);
          }, error => {
            console.error('Error submitting data:', error);
          });
      }
  
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);
  
        this.http.post(`${baseApi}/API/uploadfiles`, formData, httpOptions)
          .subscribe(response => {
            console.log('File uploaded successfully:', response);
          }, error => {
            console.error('Error uploading file:', error);
          });
      }
    }
  }  
}
