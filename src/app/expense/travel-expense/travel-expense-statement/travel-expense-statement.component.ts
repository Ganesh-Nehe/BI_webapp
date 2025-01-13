import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { TravelExpenseStatementService } from './travel-expense-statement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-travel-expense-statement',
  templateUrl: './travel-expense-statement.component.html',
  styleUrls: ['./travel-expense-statement.component.css']
})
export class TravelExpenseStatementComponent {
  travelExpenseForm: FormGroup;
  minEndDate: Date | null = null;
  travelHeads: any[] = [];
  currencies: any[] = [];
  fileData: (File | null)[] = [];
  categoryTotals: Record<number, number> = {};
  overallTotal: number = 0;
  @ViewChild('scrollableSection') scrollableSection!: ElementRef;
  minStartDate: Date | null = null;
  maxEndDate: Date | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private apiService: APIService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TravelExpenseStatementComponent>,
    private TravelExpenseStatementService: TravelExpenseStatementService,
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
      travelExpenses: this.fb.array([])
    });
    this.travelExpenseForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      this.minStartDate = startDate ? new Date(startDate) : null;
      this.updateExpenseDates();
    });
    this.travelExpenseForm.get('endDate')?.valueChanges.subscribe((endDate) => {
      this.maxEndDate = endDate ? new Date(endDate) : null;
      this.updateExpenseDates();
    });

    this.subscribeToExpenseChanges();
  }

  ngOnInit(): void {
    this.loadTravelHeads();
    this.loadCurrencies();
    this.addExpense();

    if (this.data.form === 'saveStatement'){
      console.log("create statement")
      console.log(this.data);
      if (this.data && this.data.estTravelHead) {
        this.populateForm(this.data.estTravelHead);
        if (this.data.estTravelDetails) {
          this.populateExpenses(this.data.estTravelDetails); // Populate expenses if available
        }
      }
    }else if (this.data.form === 'updateStatement'){
      //console.log("update statement");
      console.log(this.data.TravelDetails);
      if (this.data && this.data.TravelDetails) {
        this.populateForm_update(this.data.TravelDetails.travelheaddata[0]);
        if (this.data.TravelDetails) {
          this.populateExpenses_update(this.data.TravelDetails); // Populate expenses if available
        }
      }
    }

  }

  private populateForm(travelHead: any) {
    this.travelExpenseForm.patchValue({
      projectName: travelHead.projectName,
      startDate: travelHead.startDate,
      endDate: travelHead.endDate,
      location: travelHead.location,
      purpose: travelHead.purpose,
      modeOfTransport: travelHead.modeOfTransport,
    });
  }

  private populateExpenses(estTravelDetails: any) {
    this.travelExpenses.clear();
  
    if (Array.isArray(estTravelDetails.data) && estTravelDetails.data.length > 0) {
      estTravelDetails.data.forEach((estExpense: any) => {
        const expenseGroup = this.createEstTravelExpenseGroup();
        expenseGroup.patchValue({
          travelExpenseCatId: estExpense.travelExpenseCatId,
          unitCost: estExpense.unitCost,
          currencyId: estExpense.currency_Id,
          expenseDate: estExpense.expenseDate,
          hasBill: estExpense.hasBill,
          remark: estExpense.remark,
        });
  
        // Trigger valueChanges logic for travelExpenseCatId
        expenseGroup.get('travelExpenseCatId')?.updateValueAndValidity();
  
        this.travelExpenses.push(expenseGroup);
      });
    }
  }

  populateForm_update(travelheadDetails: any){
    //console.log("Populating form with:", travelheadDetails);
    this.travelExpenseForm.patchValue({
      projectName: travelheadDetails.projectName,
      startDate: travelheadDetails.startDate ? new Date(travelheadDetails.startDate) : null,
      endDate: travelheadDetails.endDate ? new Date(travelheadDetails.endDate) : null,
      location: travelheadDetails.location,
      purpose: travelheadDetails.purpose,
      modeOfTransport: travelheadDetails.modeOfTransport,
    });
  }

  populateExpenses_update(travelDetails:any){
    //console.log("Populating expenses with:", travelDetails.travelexpensedata);
    this.travelExpenses.clear();

    if (Array.isArray(travelDetails.travelexpensedata) && travelDetails.travelexpensedata.length > 0) {
      travelDetails.travelexpensedata.forEach((expense: any) => {
            const expenseGroup = this.createEstTravelExpenseGroup();

            expenseGroup.patchValue({
              travelExpenseCatId: +expense.travelExpenseCatId, 
              unitCost: expense.unitCost,
              currencyId: expense.currency_Id,             
              expenseDate: new Date(expense.expenseDate),
              remark: expense.remark,
              hasBill: expense.bill_status !== "No bill"   
            });

            this.travelExpenses.push(expenseGroup);
        });
    }
  }

  async loadTravelHeads(): Promise<void> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response: any = await this.http.get(`${baseApi}/API/expense/travelHead`, httpOptions).toPromise();
      this.travelHeads = response.data;
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
    this.travelExpenses.push(this.createEstTravelExpenseGroup());
    this.fileData.push(null);
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  removeExpense(index: number): void {
    this.travelExpenses.removeAt(index);
    this.fileData.splice(index, 1);
  }

  updateExpenseDates(): void {
    this.travelExpenses.controls.forEach((control) => {
      const expenseDateControl = control.get('expenseDate');
      if (expenseDateControl) {
        // Set the min and max date constraints for the expenseDate field
        expenseDateControl.setValidators([
          Validators.required,
          Validators.min(this.minStartDate ? this.minStartDate.getTime() : 0),
          Validators.max(this.maxEndDate ? this.maxEndDate.getTime() : Date.now())
        ]);
        expenseDateControl.updateValueAndValidity();
      }
    });
  }

  subscribeToExpenseChanges(): void {
    this.travelExpenses.valueChanges.pipe(map(() => this.calculateTotals())).subscribe();
  }

  calculateTotals(): void {
    this.categoryTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.overallTotal = 0;

    this.travelExpenses.controls.forEach((control) => {
      const catId = control.get('travelExpenseCatId')?.value;
      const cost = control.get('unitCost')?.value;
      if (catId && cost) {
        this.categoryTotals[catId] = (this.categoryTotals[catId] || 0) + parseFloat(cost);
        this.overallTotal += parseFloat(cost);
      }
    });
  }

  scrollToBottom() {
    const element = this.scrollableSection.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  get travelExpenses(): FormArray {
    return this.travelExpenseForm.get('travelExpenses') as FormArray;
  }

  createEstTravelExpenseGroup(): FormGroup {
    const group = this.fb.group({
      travelExpenseCatId: ['', Validators.required],
      currencyId: ['', Validators.required],
      unitCost: [0, Validators.required],     
      expenseDate: ['', Validators.required],
      remark: ['', Validators.required],
      hasBill: [false],
      billStatus: ['No bill'],
    });
  
    return group;
  }

  toggleFileUpload(index: number): void {
    const expense = this.travelExpenses.at(index);
    if (expense.get('hasBill')?.value) {
      expense.patchValue({ billStatus: 'Bill' });  
    } else {
      expense.patchValue({ billStatus: 'No bill' }); 
      this.fileData[index] = null;
    }
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedFormats = ['image/jpeg', 'image/png'];
  
      if (allowedFormats.includes(file.type)) {
        this.fileData[index] = file; 
      } else {
        alert("file format not supported, insert only JPG and PNG format files");
        input.value = ''; 
      }
    }
    this.toggleFileUpload(index);
  }

  async addTravelExpense() {
    if (this.isSaving) return;
    this.isSaving = true;
    const formData = new FormData();
    const formValue = this.travelExpenseForm.getRawValue();

    Object.keys(formValue).forEach(key => {
      if (key === 'travelExpenses') {
        formValue[key].forEach((expense: any, index: number) => {
          Object.keys(expense).forEach(expenseKey => {
            formData.append(`travelExpenses[${index}][${expenseKey}]`, expense[expenseKey]);
          });
        });
      } else {
        formData.append(key, formValue[key]);
      }
    });

    this.fileData.forEach((file, index) => {
      if (file) {
        formData.append(`file_${index}`, file, file.name);
      }
    });
  
    if (this.travelExpenseForm.valid) {
      try{
        if (this.data.form === 'saveStatement') {
          formData.append('EstTravelHeadId', this.data.estTravelHead.EstTravelHeadId);
          const result = await this.TravelExpenseStatementService.addTravelExpense(formData);
          this.dialogRef.close(true);
          this.snackBar.open('Travel added successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        } else if (this.data.form === 'updateStatement') {
          formData.append('travelId', this.data.TravelDetails.travelheaddata[0].travelId);
          const result = await this.TravelExpenseStatementService.updateTravelExpense(formData);
          this.dialogRef.close(true);
          this.snackBar.open('Travel updated successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        }else{
          this.snackBar.open('Error', 'Close', {
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
