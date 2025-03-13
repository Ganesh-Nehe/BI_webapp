import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddChalanDialogService } from './add-chalan-dialog.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add-chalan-dialog',
  templateUrl: './add-chalan-dialog.component.html',
  styleUrls: ['./add-chalan-dialog.component.css']
})

export class AddChalanDialogComponent {

  chalanForm: FormGroup;
  addressTypes: any[] = [];
  selectedFile: File = null!;
  customers: any[] = [];
  selectedCustomer: any = null;
  locations: any[] = [];
  selectedLocation: any = null;
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
      customerId: [, Validators.required],
      addressId: [, Validators.required],
      preparedBy: ['', Validators.required],
      chalanDate: [, Validators.required],
      isReturnable: [],
      returnDate: [],
      PoNo: [],
      PODate: [],
      materials: this.fb.array([])
    });
    this.chalanForm.get('customerId')?.valueChanges.subscribe((customerId) => {
      this.updateSelectedCustomer(customerId);
      this.loadLocations();
    });
    this.chalanForm.get('addressId')?.valueChanges.subscribe((addressId) => {
      this.updateSelectedAdress(addressId);
    });
  }

  ngOnInit(): void {
    this.addBranches();
    this.loadCustomers();

    if (this.data) {
      console.log(this.data);
      this.populateForm(this.data.row);
      this.populateBranches(this.data.res);
    }
  }

  private populateForm(customerDetails: any) {
    this.chalanForm.patchValue({
      customerId: customerDetails.customerId,
      addressId: customerDetails.addressId,
      preparedBy: customerDetails.preparedBy,
      chalanDate: customerDetails.chalanDate,
      isReturnable: customerDetails.isReturnable,
      returnDate: customerDetails.returnDate,
      PoNo: customerDetails.PoNo,
      PODate: customerDetails.PODate,

    });
    this.updateSelectedCustomer(customerDetails.customerId);
  }

  private populateBranches(materials: any) {
    this.materials.clear(); // Clear existing form groups in the expenses array

    if (Array.isArray(materials.data) && materials.data.length > 0) {
      materials.data.forEach((branch: any) => {
        const materialGroup = this.createBranchGroup();

        materialGroup.patchValue({
          itemCode: branch.itemCode,
          itemDesc: branch.itemDesc,
          SAC_HSNcode: branch.SAC_HSNcode,
          quantity : branch.quantity,
          unit: branch.unit
        });

        this.materials.push(materialGroup);
      });
    }
  }

  get materials(): FormArray {
    return this.chalanForm.get('materials') as FormArray;
  }

  createBranchGroup(): FormGroup {
    return this.fb.group({
      itemCode: ['', Validators.required],
      itemDesc: ['', Validators.required],
      SAC_HSNcode: [''],
      quantity: ['', Validators.required],
      unit: ['', Validators.required],
    });
  }

  updateSelectedCustomer(customerId: number) {
    this.selectedCustomer = this.customers.find(c => c.customerId === customerId) || null;
    console.log("Selected Customer Details:", this.selectedCustomer);
  }

  updateSelectedAdress(addressId: number) {
    this.selectedLocation = this.locations.find(l => l.addressId === addressId) || null;
    console.log("Selected Customer Details:", this.selectedLocation);
  }

  async loadCustomers() {
    try {
      const response = await this.addChalanDialogService.loadCustomerList()
      this.customers = response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  }

  async loadLocations() {
    const customerId = this.chalanForm.get('customerId')?.value;
    console.log(customerId)
    try {
      const response = await this.addChalanDialogService.loadLocationList(customerId)
      this.locations = response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }

  addBranches(): void {
    this.materials.push(this.createBranchGroup());
  }

  removeBranch(index: number): void {
    this.materials.removeAt(index);
  }

  async addChalanDetails(): Promise<void> {
    if (this.isSaving) return;
    this.isSaving = true;
    const formData = this.chalanForm.getRawValue();
    const businessId: number = Number(localStorage.getItem('businessId'));
    const requestData = { 
      ...formData, 
      businessId, 
      returnDate: formData.returnDate ? formData.returnDate : null,
      isReturnable: formData.isReturnable ? true : null
    };
    
    //console.log(requestData);

    const requiredFields = ['customerId', 'addressId', 'preparedBy', 'chalanDate']; 
    const isFormValid = requiredFields.every(field => requestData[field]); // check every field except returnDate and isReturnable
    if (isFormValid) {
      if (!this.data) {
        try {
          const res = await this.addChalanDialogService.addChalanDetails(requestData);
          this.snackBar.open('Chalan Details Addess Successsfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
          this.dialogRef.close(true);
        } catch (error) {
          this.snackBar.open('Error Adding Chalam Details', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-error']
          });
        } finally {
          this.isSaving = false;
        }
      } else {
        try {
          const chalanId = this.data.row.chalanId;
          const updateData = { 
            ...requestData, 
            chalanId,

          };
          const res = await this.addChalanDialogService.updateChalanDetails(updateData);
          this.snackBar.open('Chalan Details Updated Successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-error']
          });
          this.dialogRef.close(true);
        } catch (error) {
          this.snackBar.open('Error Updating Chalan Details', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-error']
          });
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
