import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { AddTravelExpenseService } from './add-travel-expense.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-travel-expense',
  templateUrl: './add-travel-expense.component.html',
  styleUrls: ['./add-travel-expense.component.css'],
})
export class AddTravelExpenseComponent implements OnInit {
  travelExpenseForm: FormGroup;
  minEndDate: Date | null = null;
  estTravelHeads: any[] = [];
  currencies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: APIService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddTravelExpenseComponent>,
    private AddTravelExpenseService: AddTravelExpenseService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.travelExpenseForm = this.fb.group({
      projectName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      purpose: ['', Validators.required],
      modeOfTransport: ['', Validators.required],
      estTravelExpenses: this.fb.array([])
    });
    this.travelExpenseForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      this.minEndDate = startDate ? new Date(startDate) : null;
    });
    this.travelExpenseForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      this.minEndDate = startDate ? new Date(startDate) : null;
      this.updateNoOfDays();
    });

    this.travelExpenseForm.get('endDate')?.valueChanges.subscribe(() => {
      this.updateNoOfDays();
    })
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
    const startDate = this.travelExpenseForm.get('startDate')?.value;
    const endDate = this.travelExpenseForm.get('endDate')?.value;
  
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
  }
  

  getAvailableHeads(index: number): any[] {
    const selectedHeads = this.estTravelExpenses.controls
      .map((control) => control.get('travelExpenseCatId')?.value)
      .filter((value) => value !== null && value !== undefined);

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
    this.travelExpenseForm.patchValue({
      projectName: estTravelHead.projectName,
      startDate: estTravelHead.startDate,
      endDate: estTravelHead.endDate,
      location: estTravelHead.location,
      purpose: estTravelHead.purpose,
      modeOfTransport: estTravelHead.modeOfTransport,
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
    return this.travelExpenseForm.get('estTravelExpenses') as FormArray;
  }

  createEstTravelExpenseGroup(): FormGroup {
    const group = this.fb.group({
      travelExpenseCatId: ['', Validators.required],
      currencyId: ['', Validators.required],
      unitCost: [0, Validators.required],
      
      noOfDays: [0, Validators.required],
      remark: [''],
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

  async addTravelEstimate() {
    const userId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
  
    // Map form data to handle optional fields
    const formData = {
      ...this.travelExpenseForm.value,
      employeeId: userId,
      businessId: businessId,
      estTravelExpenses: this.travelExpenseForm.value.estTravelExpenses.map((expense: any) => ({
        ...expense,
        remark: expense.remark || null, // Convert empty remarks to null
      })),
    };
  
    if (this.travelExpenseForm.valid) {
      if (!this.data) {
        const result = await this.AddTravelExpenseService.addTravelEstimate(formData);
        this.dialogRef.close(true);
        this.snackBar.open('Estimate Travel added successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
      } else {
        formData['EstTravelHeadId'] = this.data.estTravelHead.EstTravelHeadId;
        const result = await this.AddTravelExpenseService.updateTravelEstimate(formData);
        this.dialogRef.close(true);
        this.snackBar.open('Estimate Travel updated successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
      }
    } else {
      const invalidFields = Object.keys(this.travelExpenseForm.controls).filter((field) => {
        return this.travelExpenseForm.get(field)?.invalid;
      });
  
      const alertMessage = `The following fields are incomplete or invalid:\n\n${invalidFields.join('\n')}`;
      alert(alertMessage);
    }
  }
  
}
