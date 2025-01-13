import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-voucher-expense',
  templateUrl: './add-voucher-expense.component.html',
  styleUrls: ['./add-voucher-expense.component.css']
})
export class AddVoucherExpenseComponent implements OnInit {

  voucherExpenseData: FormGroup;
  voucherHeads: any[] = [];
  currencies: any[] = [];
  totalExpenseAmount: number = 0; 
  fileData: (File | null)[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private dialogref: MatDialogRef<AddVoucherExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.voucherExpenseData = this.fb.group({
      mischeadname: ['', Validators.required],
      expenses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadVoucherHeads();
    this.loadCurrencies();
    this.addExpense(); // Initialize with one expense form group
  
    if (this.data && this.data.voucherHead) {
      this.populateForm(this.data.voucherHead);
      if (this.data.voucherDetails) {
        console.log(this.data);
        this.populateExpenses(this.data.voucherDetails); // Populate expenses if available
      }
    }
  }

  private populateForm(voucherHead: any) {
    this.voucherExpenseData.patchValue({
      mischeadname: voucherHead.mischeadname,
      // Any other fields from voucherHead can be populated here
    });
  }
  
  private populateExpenses(voucherDetails: any) {
    this.expenses.clear(); // Clear existing form groups in the expenses array

    if (Array.isArray(voucherDetails.data) && voucherDetails.data.length > 0) {
        voucherDetails.data.forEach((expense: any) => {
            const expenseGroup = this.createExpenseGroup();

            expenseGroup.patchValue({
                expenseDescription: expense.expenseDescription,
                expenseDate: new Date(expense.expenseDate),
                miscExpenseAmount: expense.miscExpenseAmount,
                miscExpenseCatId: +expense.miscExpenseCatId,  // Sets category ID to pre-select option
                currencyId: expense.currencyId,              // Sets currency ID to pre-select option
                hasBill: expense.bill_status !== "No bill"   // Converts bill status to boolean
            });

            this.expenses.push(expenseGroup);
        });
    }

    this.calculateTotalExpenseAmount(); // Recalculate total expense after populating
}

  get expenses(): FormArray {
    return this.voucherExpenseData.get('expenses') as FormArray;
  }

  createExpenseGroup(): FormGroup {
    return this.fb.group({
      miscExpenseCatId: ['', Validators.required],
      expenseDate: ['', Validators.required],
      miscExpenseAmount: ['', Validators.required],
      currencyId: ['', Validators.required],
      expenseDescription: ['', Validators.required],
      hasBill: [false],
      billStatus: ['No bill'],
      billLocation: ['']
    });
  }

  addExpense(): void {
    this.expenses.push(this.createExpenseGroup());
    this.fileData.push(null);
  }

  removeExpense(index: number): void {
    this.expenses.removeAt(index);
    this.fileData.splice(index, 1);
    this.calculateTotalExpenseAmount();
  }

  dialogclose() {
    this.dialogref.close(true);
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedFormats = ['image/jpeg', 'image/png'];
  
      if (allowedFormats.includes(file.type)) {
        this.fileData[index] = file; 
      } else {
        //this.snackBar.open('file format not supported', 'Close', {
          //duration: 3000,
          //verticalPosition: 'top',
          //horizontalPosition: 'center',
          //panelClass: ['snackbar-error']
        //});
        alert("file format not supported, insert only JPG and PNG format files");
        input.value = ''; 
      }
    }
    this.toggleFileUpload(index);
  }

  toggleFileUpload(index: number): void {
    const expense = this.expenses.at(index);
    if (expense.get('hasBill')?.value) {
      expense.patchValue({ billStatus: 'Bill' });  
    } else {
      expense.patchValue({ billStatus: 'No bill' }); 
      this.fileData[index] = null;
    }
  }
  
  calculateTotalExpenseAmount(): void {
    this.totalExpenseAmount = this.expenses.controls.reduce((sum, control) => {
      const amount = control.get('miscExpenseAmount')?.value;
      return sum + (amount ? parseFloat(amount) : 0);
    }, 0);
  }

  async loadVoucherHeads(): Promise<void> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    
    try {
      const response: any = await this.http.get(`${baseApi}/API/expense/voucherhead`, httpOptions).toPromise();
      this.voucherHeads = response.data;
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

  async addVoucherexpense(): Promise<void> {
    if (this.isSaving) return;
    this.isSaving = true;
    this.calculateTotalExpenseAmount();
    const userId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
    const baseApi = this.apiService.getBaseApi();
    const formData = new FormData();

    formData.append('mischeadname', this.voucherExpenseData.value.mischeadname);
    formData.append('employeeId', userId ?? ''); 
    formData.append('businessId', businessId ?? '');

    this.voucherExpenseData.value.expenses.forEach((expense: any, index: number) => {
      Object.keys(expense).forEach(key => {
        formData.append(`expenses[${index}][${key}]`, expense[key]);
      });
      if (this.fileData[index]) {
        formData.append(`file${index}`, this.fileData[index] || '');
      }
    });

    formData.append('totalAmount', this.totalExpenseAmount.toString());
    if (this.data){
      formData.append('voucherId', this.data.voucherHead.voucherId);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    if (this.voucherExpenseData.valid){
      if (!this.data){
        try {
          const response = await this.http.post(`${baseApi}/API/expense/voucher/`, formData, httpOptions).toPromise();
          console.log('API Response:', response);
          this.dialogref.close(true);
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          this.isSaving = false; // Re-enable the button
        }
      }else{
        try {
          const response = await this.http.post(`${baseApi}/API/expense/updateVoucher/`, formData, httpOptions).toPromise();
          console.log('API Response:', response);
          this.dialogref.close(true);
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          this.isSaving = false; // Re-enable the button
        }
      }
    }else{
      alert("error ⚠️ Form incomplete")
      this.isSaving = false;
    }
  }
}
