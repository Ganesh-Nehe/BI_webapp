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
  @ViewChild('customerDetails') customerDetails!: ElementRef;
  @ViewChild('addressDetails') addressDetails!: ElementRef;

  customerForm: FormGroup;
  minEndDate: Date | null = null;
  estTravelHeads: any[] = [];
  currencies: any[] = [];
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
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      purpose: ['', Validators.required],
      modeOfTransport: ['', Validators.required],
      advanceRequest: ['' ,Validators.required],
      estTravelExpenses: this.fb.array([])
    });
    this.customerForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      this.minEndDate = startDate ? new Date(startDate) : null;
    });

    this.customerForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      this.minEndDate = startDate ? new Date(startDate) : null;
      this.updateNoOfDays();
    });

    this.customerForm.get('endDate')?.valueChanges.subscribe(() => {
      this.updateNoOfDays();
    });

    this.estTravelExpenses.valueChanges.subscribe(() => {
      this.updateTotals();
    });
  }

  private updateTotals(): void {
    this.estTravelExpenses.controls.forEach((control) => {
      const unitCost = control.get('unitCost')?.value || 0;
      const noOfDays = control.get('noOfDays')?.value || 0;
      const total = unitCost * noOfDays;
      control.get('total')?.patchValue(total, { emitEvent: false }); // Avoid triggering further valueChanges
    });
  }

  private updateNoOfDays(): void {
    const startDate = this.customerForm.get('startDate')?.value;
    const endDate = this.customerForm.get('endDate')?.value;
  
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      // Calculate difference in days
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
  
      // Update each expense's noOfDays only if the field is enabled
      this.estTravelExpenses.controls.forEach((control) => {
        const noOfDaysControl = control.get('noOfDays');
        if (noOfDaysControl?.enabled) {
          noOfDaysControl.patchValue(diffDays, { emitEvent: false });
        }
      });
    }
    this.updateTotals();
  }
  

  getAvailableHeads(index: number): any[] {
    const selectedHeads = this.estTravelExpenses.controls
      .map((control) => control.get('travelExpenseCatId')?.value)
      .filter((value) => value !== null && value !== undefined);

    this.updateNoOfDays();
    return this.estTravelHeads.filter(
      (head) =>
        !selectedHeads.includes(head.travelExpenseCatId) || // Exclude already selected ids
        this.estTravelExpenses.at(index)?.get('travelExpenseCatId')?.value === head.travelExpenseCatId // Allow re-selection of current index's value
    );
  }

  ngOnInit(): void {
    this.loadEstTravelHeads();
    this.loadCurrencies();
    this.addExpense();

    console.log(this.data);
    if (this.data && this.data.estTravelHead) {
      this.populateForm(this.data.estTravelHead);
      if (this.data.estTravelDetails) {
        this.populateExpenses(this.data.estTravelDetails); // Populate expenses if available
      }
    }
  }

  private populateForm(estTravelHead: any) {
    this.customerForm.patchValue({
      projectName: estTravelHead.projectName,
      startDate: estTravelHead.startDate,
      endDate: estTravelHead.endDate,
      location: estTravelHead.location,
      purpose: estTravelHead.purpose,
      modeOfTransport: estTravelHead.modeOfTransport,
      advanceRequest: estTravelHead.advanceRequest
    });
  }

  private populateExpenses(estTravelDetails: any) {
    this.estTravelExpenses.clear();
  
    if (Array.isArray(estTravelDetails.data) && estTravelDetails.data.length > 0) {
      estTravelDetails.data.forEach((estExpense: any) => {
        const expenseGroup = this.createEstTravelExpenseGroup();
        expenseGroup.patchValue({
          travelExpenseCatId: estExpense.travelExpenseCatId,
          unitCost: estExpense.unitCost,
          currencyId: estExpense.currency_Id,
          noOfDays: estExpense.noOfDays,
          remark: estExpense.remark,
        });
  
        // Trigger valueChanges logic for travelExpenseCatId
        expenseGroup.get('travelExpenseCatId')?.updateValueAndValidity();
  
        this.estTravelExpenses.push(expenseGroup);
      });
    }
  }

  async loadEstTravelHeads(): Promise<void> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response: any = await this.http.get(`${baseApi}/API/expense/travelHead`, httpOptions).toPromise();
      this.estTravelHeads = response.data;
    } catch (error) {
      console.error('Error fetching voucher heads:', error);
    }
  }

  async loadCurrencies(): Promise<void> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response: any = await this.http.get(`${baseApi}/API/currency`, httpOptions).toPromise();
      this.currencies = response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  }

  addExpense(): void {
    this.estTravelExpenses.push(this.createEstTravelExpenseGroup());
    this.updateNoOfDays();
  }

  removeExpense(index: number): void {
    this.estTravelExpenses.removeAt(index);
  }

  get estTravelExpenses(): FormArray {
    return this.customerForm.get('estTravelExpenses') as FormArray;
  }

  createEstTravelExpenseGroup(): FormGroup {
    const group = this.fb.group({
      travelExpenseCatId: ['', Validators.required],
      currencyId: ['', Validators.required],
      unitCost: [0, Validators.required],     
      noOfDays: [0, Validators.required],
      remark: ['', Validators.required],
      total: [0],
    });
  
    group.get('travelExpenseCatId')?.valueChanges.subscribe((value) => {
      const noOfDaysControl = group.get('noOfDays');
      const numericValue = Number(value); // Convert to number for comparison
      if (numericValue === 1 || numericValue === 5) { // IDs for "Cost Of Travel" and "Entertainment"
        noOfDaysControl?.setValue(1);
        noOfDaysControl?.disable(); // Lock the field
      } else {
        noOfDaysControl?.enable(); // Allow changes for other IDs
      }
    });
  
    return group;
  }

  async addCustomer() {
    if (this.isSaving) return;
    this.isSaving = true;
    const userId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
  
    // Map form data to handle optional fields
    const formData = {
      ...this.customerForm.getRawValue(),
      employeeId: userId,
      businessId: businessId,
    };
  
    if (this.customerForm.valid) {
      try{
        if (!this.data) {
          const result = await this.addCustomerDialogService.addTravelEstimate(formData);
          this.dialogRef.close(true);
          this.snackBar.open('Estimate Travel added successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        } else {
          formData['EstTravelHeadId'] = this.data.estTravelHead.EstTravelHeadId;
          const result = await this.addCustomerDialogService.updateTravelEstimate(formData);
          this.dialogRef.close(true);
          this.snackBar.open('Estimate Travel updated successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        }

      }catch{
        console.error("Error !")
      } finally {
        this.isSaving = false; // Re-enable the button
      }
    } else {
      alert("error ⚠️ Form incomplete")
      this.isSaving = false;
    }
  }
}
