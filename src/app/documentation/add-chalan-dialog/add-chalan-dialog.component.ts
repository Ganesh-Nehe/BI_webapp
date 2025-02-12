import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddChalanDialogService } from './add-chalan-dialog.service';

@Component({
  selector: 'app-add-chalan-dialog',
  templateUrl: './add-chalan-dialog.component.html',
  styleUrls: ['./add-chalan-dialog.component.css']
})

export class AddChalanDialogComponent {

  chalanForm: FormGroup;
  addressTypes: any[] = [];
  selectedFile: File = null!;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private apiService: APIService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddChalanDialogComponent>,
    private addChalanDialogService: AddChalanDialogService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.chalanForm = this.fb.group({
      itemCode: ['', Validators.required],
      itemDesc: ['', Validators.required],
      SAC_HSNcode: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
      materials: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAddressTypes();
    this.addBranches();

    // if (this.data) {
    //   console.log(this.data);
    //   this.populateForm(this.data.row);
    //   this.populateBranches(this.data.res);
    // }
  }

  private populateForm(customerDetails: any) {
    this.chalanForm.patchValue({
      customerName: customerDetails.customerName,
      contactPerson: customerDetails.contactPerson,
      contactPersonNo: customerDetails.contactPersonNo,
      gstNo: customerDetails.gstNo
      // Any other fields from voucherHead can be populated here
    });
  }

  private populateBranches(customerAddresses: any) {
    this.materials.clear(); // Clear existing form groups in the expenses array

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

        this.materials.push(branchGroup);
      });
    }
  }

  get materials(): FormArray {
    return this.chalanForm.get('materials') as FormArray;
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
    this.materials.push(this.createBranchGroup());
  }

  removeBranch(index: number): void {
    this.materials.removeAt(index);
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

    formData.append('customerName', this.chalanForm.value.customerName);
    formData.append('contactPerson', this.chalanForm.value.contactPerson);
    formData.append('contactPersonNo', this.chalanForm.value.contactPersonNo);
    formData.append('gstNo', this.chalanForm.value.gstNo);
    formData.append('businessId', businessId ?? '');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.chalanForm.value.materials.forEach((materials: any, index: number) => {
      Object.keys(materials).forEach(key => {
        formData.append(`materials[${index}][${key}]`, materials[key]);
      });
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    if (this.chalanForm.valid) {
      if (!this.data) {
        try {
          const res = await this.addChalanDialogService.addCustomerDeatils(formData);
          console.log('API Response:', res);
          this.dialogRef.close(true);
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          this.isSaving = false;
        }
      } else {
        formData.append('customerId', this.data.row.customerId);
        try {
          const res = await this.addChalanDialogService.updateCustomerDeatils(formData);
          console.log('API Response:', res);
          this.dialogRef.close(true);
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          this.isSaving = false;
        }
      }
    } else {
      alert("error ⚠️ Form incomplete")
      this.isSaving = false;
    }
  }
}
