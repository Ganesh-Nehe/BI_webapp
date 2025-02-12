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
  addressTypes: any[] = [];
  selectedFile: File = null!;
  isSaving = false;

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
      customerName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      contactPersonNo: [, Validators.required],
      gstNo: [, Validators.required],
      branchAddress: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAddressTypes();
    this.addBranches();
  
    if (this.data) {
      console.log(this.data);
      this.populateForm(this.data.row);
      this.populateBranches(this.data.res);
    }
  }

  private populateForm(customerDetails: any) {
    this.customerForm.patchValue({
      customerName: customerDetails.customerName,
      contactPerson: customerDetails.contactPerson,
      contactPersonNo: customerDetails.contactPersonNo,
      gstNo: customerDetails.gstNo
      // Any other fields from voucherHead can be populated here
    });
  }
  
  private populateBranches(customerAddresses: any) {
    this.branchAddress.clear(); // Clear existing form groups in the expenses array

    if (Array.isArray(customerAddresses.data) && customerAddresses.data.length > 0) {
      customerAddresses.data.forEach((branch: any) => {
            const branchGroup = this.createBranchGroup();

            branchGroup.patchValue({
              addressTypeId: branch.addressTypeId,
              localArea: branch.localArea,
              city: branch.city,
              state: branch.state,
              country: branch.country,
              pinCode: branch.pinCode
            });

            this.branchAddress.push(branchGroup);
        });
    }
}

  get branchAddress(): FormArray {
    return this.customerForm.get('branchAddress') as FormArray;
  }

  createBranchGroup(): FormGroup {
    return this.fb.group({
      addressTypeId: [, Validators.required],
      localArea: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pinCode: ['', Validators.required]
    });
  }

  addBranches(): void {
    this.branchAddress.push(this.createBranchGroup());
  }

  removeBranch(index: number): void {
    this.branchAddress.removeAt(index);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async loadAddressTypes(): Promise<void> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    
    try {
      const response: any = await this.http.get(`${baseApi}/API/addressTypes/`, httpOptions).toPromise();
      this.addressTypes = response.data;
    } catch (error) {
      console.error('Error fetching voucher heads:', error);
    }
  }

  async addCustomerDetails(): Promise<void> {
    if (this.isSaving) return;
    this.isSaving = true;
    const businessId = localStorage.getItem('businessId');
    const baseApi = this.apiService.getBaseApi();
    const formData = new FormData();

    formData.append('customerName', this.customerForm.value.customerName);
    formData.append('contactPerson', this.customerForm.value.contactPerson);
    formData.append('contactPersonNo', this.customerForm.value.contactPersonNo);
    formData.append('gstNo', this.customerForm.value.gstNo);
    formData.append('businessId', businessId ?? '');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.customerForm.value.branchAddress.forEach((branchAddress: any, index: number) => {
      Object.keys(branchAddress).forEach(key => {
        formData.append(`branchAddresses[${index}][${key}]`, branchAddress[key]);
      });
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    if (this.customerForm.valid){
      if (!this.data){
        try {
          const res = await this.addCustomerDialogService.addCustomerDeatils(formData);
          console.log('API Response:', res);
          this.dialogRef.close(true);
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          this.isSaving = false;
        }
      }else{
        formData.append('customerId', this.data.row.customerId);
        try {
          const res = await this.addCustomerDialogService.updateCustomerDeatils(formData);
          console.log('API Response:', res);
          this.dialogRef.close(true);
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          this.isSaving = false;
        }
      }
    }else{
      alert("error ⚠️ Form incomplete")
      this.isSaving = false;
    }
  }
}
