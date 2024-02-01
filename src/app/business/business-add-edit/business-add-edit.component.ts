import { Component } from '@angular/core';
import { FormBuilder, FormGroup,  FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from '../../api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-business-add-edit',
  templateUrl: './business-add-edit.component.html',
  styleUrls: ['./business-add-edit.component.css']
})
export class BusinessAddEditComponent {

  businessForm: FormGroup;
  selectedFile: File | null = null;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private dialogRef: MatDialogRef<BusinessAddEditComponent>
  ) {
    this.businessForm = this.fb.group({
      businessName: '',
      CIN_no: '',
      PAN_no: '',
      logoFileLocation: new FormControl(null),
      addressTypeId: '',
      addressLine_1: '',
      addressLine_2: '',
      city: '',
      state: '',
      isoCountryCode: '',
      pinCode: '',
    });

  }

  onFileSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFile = fileInput.files[0];
      this.businessForm.patchValue({ logoFileLocation: this.selectedFile });
    }
  }


  addBusinessData() {
    const baseApi = this.apiService.getBaseApi();
    const businessFormData = this.businessForm.value;

    const formData = {
      businessData: {
        businessName: businessFormData.businessName,
        CIN_no: businessFormData.CIN_no,
        PAN_no: businessFormData.PAN_no,
        logoFileLocation: businessFormData.logoFileLocation
      },
      addressData: {
        addressTypeId: businessFormData.addressTypeId,
        addressLine_1: businessFormData.addressLine_1,
        addressLine_2: businessFormData.addressLine_2,
        city: businessFormData.city,
        state: businessFormData.state,
        isoCountryCode: businessFormData.isoCountryCode,
        pinCode: businessFormData.pinCode
      }
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    this.http.post(`${baseApi}/API/business/`, formData, httpOptions)
      .subscribe(response => {
        console.log('Data submitted successfully:', response);
        this.dialogRef.close();
      }, error => {
        console.error('Error submitting data:', error);
      });
  }
}
